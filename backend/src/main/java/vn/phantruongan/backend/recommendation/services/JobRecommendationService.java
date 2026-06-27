package vn.phantruongan.backend.recommendation.services;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.common.email.EmailService;
import vn.phantruongan.backend.config.common.RabbitMQConfig;
import vn.phantruongan.backend.cronjob.entities.CronJob;
import vn.phantruongan.backend.cronjob.services.CronJobService;
import vn.phantruongan.backend.follow.repositories.CompanyFollowRepository;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.job.repositories.JobRepository;
import vn.phantruongan.backend.recommendation.dtos.RecommendationEmailMessage;
import vn.phantruongan.backend.recommendation.dtos.req.GetJobRecommendationReqDTO;
import vn.phantruongan.backend.recommendation.dtos.res.JobRecommendationResDTO;
import vn.phantruongan.backend.recommendation.entities.JobRecommendation;
import vn.phantruongan.backend.recommendation.enums.EmailStatus;
import vn.phantruongan.backend.recommendation.enums.RecommendationStatus;
import vn.phantruongan.backend.recommendation.repositories.JobRecommendationRepository;
import vn.phantruongan.backend.recommendation.specification.JobRecommendationSpecification;
import vn.phantruongan.backend.subscriber.entities.Subscriber;
import vn.phantruongan.backend.subscriber.repositories.SubscriberRepository;
import vn.phantruongan.backend.util.error.InvalidException;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobRecommendationService {

    private final JobRecommendationRepository jobRecommendationRepository;
    private final JobRepository jobRepository;
    private final SubscriberRepository subscriberRepository;
    private final CronJobService cronJobService;
    private final CompanyFollowRepository companyFollowRepository;
    private final ObjectMapper objectMapper;
    private final EmailService emailService;
    private final RabbitTemplate rabbitTemplate;

    // =========================================================
    // CRUD & Query
    // =========================================================

    public PaginationResponse<JobRecommendationResDTO> getAllJobRecommendations(
            GetJobRecommendationReqDTO filter, Pageable pageable) {

        JobRecommendationSpecification spec = new JobRecommendationSpecification(filter);
        Page<JobRecommendation> page = jobRecommendationRepository.findAll(spec, pageable);

        List<JobRecommendationResDTO> list = page.getContent()
                .stream()
                .map(this::convertToResDTO)
                .collect(Collectors.toList());

        PaginationResponse<JobRecommendationResDTO> response = new PaginationResponse<>();
        response.setResult(list);
        response.setMeta(new PaginationResponse.Meta(
                page.getNumber() + 1,
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()));
        return response;
    }

    public JobRecommendationResDTO getJobRecommendationById(Long id) throws InvalidException {
        JobRecommendation recommendation = jobRecommendationRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Không tìm thấy gợi ý công việc"));
        return convertToResDTO(recommendation);
    }

    public JobRecommendationResDTO updateRecommendationStatus(Long id, RecommendationStatus status)
            throws InvalidException {
        JobRecommendation recommendation = jobRecommendationRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Không tìm thấy gợi ý công việc"));
        recommendation.setStatus(status);

        // Auto-set sentAt when status changes to SENT
        if (status == RecommendationStatus.APPLIED && recommendation.getSentAt() == null) {
            recommendation.setSentAt(Instant.now());
        }

        return convertToResDTO(jobRecommendationRepository.save(recommendation));
    }

    public JobRecommendationResDTO updateEmailStatus(Long id, EmailStatus status) throws InvalidException {
        JobRecommendation recommendation = jobRecommendationRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Không tìm thấy gợi ý công việc"));
        recommendation.setEmailStatus(status);

        // Auto-set sentAt when status changes to SENT
        if (status == EmailStatus.SENT && recommendation.getSentAt() == null) {
            recommendation.setSentAt(Instant.now());
        }

        return convertToResDTO(jobRecommendationRepository.save(recommendation));
    }

    public void deleteJobRecommendation(Long id) throws InvalidException {
        if (!jobRecommendationRepository.existsById(id)) {
            throw new InvalidException("Không tìm thấy gợi ý công việc");
        }
        jobRecommendationRepository.deleteById(id);
    }

    // =========================================================
    // Recommendation Generation Engine
    // =========================================================

    public void generateJobRecommendations() {
        CronJob config = cronJobService.getJobRecommendationConfig();

        if (!config.getIsEnabled()) {
            log.info("Job recommendation engine is disabled.");
            return;
        }

        log.info("Starting job recommendation generation...");

        List<Subscriber> subscribers = subscriberRepository.findAllWithSkills();
        List<Job> jobs = jobRepository.findAllWithSkills();

        log.info("Loaded {} subscribers and {} jobs for recommendation.",
                subscribers.size(), jobs.size());

        jobs = applyJobFilters(jobs, config);

        if (subscribers.isEmpty() || jobs.isEmpty()) {
            log.info("No subscribers or jobs to process. Finishing.");
            return;
        }

        int batchSize = 50;
        int batchCount = 0;

        for (int i = 0; i < subscribers.size(); i += batchSize) {
            batchCount++;
            int end = Math.min(i + batchSize, subscribers.size());
            List<Subscriber> batch = subscribers.subList(i, end);

            log.info("Processing batch {} (subscribers {}-{})", batchCount, i + 1, end);

            List<RecommendationEmailMessage> messages = processSubscriberBatch(batch, jobs, config);

            for (RecommendationEmailMessage msg : messages) {
                rabbitTemplate.convertAndSend(
                        RabbitMQConfig.EXCHANGE_RECOMMENDATION_EMAIL,
                        RabbitMQConfig.ROUTING_KEY_RECOMMENDATION_EMAIL,
                        msg
                );
                log.info("Published recommendation email message to RabbitMQ for: {}", msg.getSubscriberEmail());
            }
        }

        log.info("Job recommendation generation completed.");
    }

    private List<Job> applyJobFilters(List<Job> jobs, CronJob config) {
        // Filter by last 24h
        if (Boolean.TRUE.equals(config.getOnlyLast24h())) {
            Instant dayAgo = Instant.now().minus(24, ChronoUnit.HOURS);
            jobs = jobs.stream()
                    .filter(j -> j.getCreatedAt() != null && j.getCreatedAt().isAfter(dayAgo))
                    .collect(Collectors.toList());
            log.info("Filtered to {} jobs posted in the last 24h", jobs.size());
        }

        // Skip inactive jobs
        if (Boolean.TRUE.equals(config.getSkipInactiveJobs())) {
            jobs = jobs.stream()
                    .filter(Job::isActive)
                    .collect(Collectors.toList());
            log.info("Filtered to {} active jobs", jobs.size());
        }

        // Skip expired jobs (endDate < now)
        if (Boolean.TRUE.equals(config.getSkipExpiredJobs())) {
            Instant now = Instant.now();
            jobs = jobs.stream()
                    .filter(j -> j.getEndDate() == null || j.getEndDate().isAfter(now))
                    .collect(Collectors.toList());
            log.info("Filtered to {} non-expired jobs", jobs.size());
        }

        return jobs;
    }

    @Transactional
    public List<RecommendationEmailMessage> processSubscriberBatch(
            List<Subscriber> subscribers,
            List<Job> jobs,
            CronJob config) {

        List<JobRecommendation> toSave = new ArrayList<>();

        for (Subscriber subscriber : subscribers) {

            long existingPending = jobRecommendationRepository
                    .countBySubscriber_IdAndStatus(
                            subscriber.getId(),
                            RecommendationStatus.PENDING);

            int canAdd = config.getMaxJobsPerSubscriber() - (int) existingPending;

            if (canAdd <= 0) {
                continue;
            }

            Set<Long> subscriberSkillIds = subscriber.getSubscriberSkills()
                    .stream()
                    .map(ss -> ss.getSkill().getId())
                    .collect(Collectors.toSet());

            if (subscriberSkillIds.isEmpty()) {
                continue;
            }

            Set<Long> followedCompanyIdSet = Set.copyOf(
                    companyFollowRepository.findFollowedCompanyIdsByEmail(subscriber.getEmail()));

            int addedCount = 0;

            for (Job job : jobs) {

                if (addedCount >= canAdd)
                    break;

                if (Boolean.TRUE.equals(config.getSkipDuplicates())
                        && jobRecommendationRepository.existsBySubscriber_IdAndJob_Id(
                                subscriber.getId(), job.getId())) {
                    continue;
                }

                Set<Long> jobSkillIds = job.getJobSkills()
                        .stream()
                        .map(js -> js.getSkill().getId())
                        .collect(Collectors.toSet());

                if (jobSkillIds.isEmpty())
                    continue;

                double score = calculateWeightedScore(
                        subscriber,
                        subscriberSkillIds,
                        job,
                        jobSkillIds,
                        followedCompanyIdSet,
                        config);

                if (score < config.getMinMatchPercentage())
                    continue;

                List<String> matchedSkillNames = job.getJobSkills()
                        .stream()
                        .filter(js -> subscriberSkillIds.contains(js.getSkill().getId()))
                        .map(js -> js.getSkill().getName())
                        .toList();

                String reason = String.format(
                        "Matched %d/%d required skills",
                        matchedSkillNames.size(),
                        jobSkillIds.size());

                if (job.getCompany() != null &&
                        followedCompanyIdSet.contains(job.getCompany().getId())) {
                    reason += " + following company";
                }

                JobRecommendation recommendation = new JobRecommendation();
                recommendation.setSubscriber(subscriber);
                recommendation.setJob(job);
                recommendation.setEmailStatus(EmailStatus.PENDING);
                recommendation.setStatus(RecommendationStatus.PENDING);
                recommendation.setMatchScore(Math.min(score, 100.0));
                recommendation.setMatchedSkills(toJson(matchedSkillNames));
                recommendation.setReason(reason);

                toSave.add(recommendation);
                addedCount++;
            }

            if (addedCount > 0) {
                log.info("Generated {} recommendations for subscriber {}",
                        addedCount,
                        subscriber.getEmail());
            }
        }

        List<RecommendationEmailMessage> messages = new ArrayList<>();
        if (!toSave.isEmpty()) {
            List<JobRecommendation> saved = jobRecommendationRepository.saveAll(toSave);
            log.info("Saved {} recommendations.", saved.size());

            // Group saved by subscriber to package into messages
            java.util.Map<Subscriber, List<JobRecommendation>> grouped = saved.stream()
                    .collect(Collectors.groupingBy(JobRecommendation::getSubscriber));

            for (java.util.Map.Entry<Subscriber, List<JobRecommendation>> entry : grouped.entrySet()) {
                Subscriber sub = entry.getKey();
                List<Long> ids = entry.getValue().stream()
                        .map(JobRecommendation::getId)
                        .collect(Collectors.toList());

                messages.add(RecommendationEmailMessage.builder()
                        .subscriberId(sub.getId())
                        .subscriberEmail(sub.getEmail())
                        .subscriberName(null) // or full name if sub has it
                        .recommendationIds(ids)
                        .build());
            }
        }

        return messages;
    }

    /**
     * Calculate weighted recommendation score (0–100).
     * Components:
     * - skillMatchWeight: % of job's required skills matched by subscriber
     * - companyFollowWeight: bonus if subscriber follows the company
     * - industryWeight: placeholder (not yet implemented – defaults to 0)
     * - locationWeight: placeholder (not yet implemented – defaults to 0)
     * - salaryWeight: placeholder (not yet implemented – defaults to 0)
     */
    private double calculateWeightedScore(
            Subscriber subscriber, Set<Long> subscriberSkillIds,
            Job job, Set<Long> jobSkillIds,
            Set<Long> followedCompanyIds, CronJob config) {

        double score = 0.0;
        int totalWeight = config.getSkillMatchWeight()
                + config.getCompanyFollowWeight()
                + config.getIndustryWeight()
                + config.getLocationWeight()
                + config.getSalaryWeight();

        if (totalWeight == 0)
            totalWeight = 100;

        // 1. Skill match component
        long matchingCount = jobSkillIds.stream().filter(subscriberSkillIds::contains).count();
        double skillMatchRatio = (double) matchingCount / jobSkillIds.size(); // 0.0 – 1.0
        score += skillMatchRatio * config.getSkillMatchWeight();

        // 2. Company follow component (binary: full weight or 0)
        if (job.getCompany() != null && followedCompanyIds.contains(job.getCompany().getId())) {
            score += config.getCompanyFollowWeight();
        }

        // 3. Industry weight — future: compare subscriber industry preference with job
        // industry
        // score += industryMatchRatio * config.getIndustryWeight();

        // 4. Location weight — future: compare subscriber preferred location with job
        // location
        // score += locationMatchRatio * config.getLocationWeight();

        // 5. Salary weight — future: compare subscriber expected salary range
        // score += salaryMatchRatio * config.getSalaryWeight();

        // Normalize to 0–100 based on total configured weights
        return (score / totalWeight) * 100.0;
    }

    // =========================================================
    // Helpers
    // =========================================================

    public JobRecommendationResDTO convertToResDTO(JobRecommendation recommendation) {
        List<String> matchedSkills = parseJson(recommendation.getMatchedSkills());

        String companyName = null;
        Long companyId = null;
        if (recommendation.getJob() != null && recommendation.getJob().getCompany() != null) {
            companyName = recommendation.getJob().getCompany().getName();
            companyId = recommendation.getJob().getCompany().getId();
        }

        return JobRecommendationResDTO.builder()
                .id(recommendation.getId())
                .subscriberId(recommendation.getSubscriber() != null ? recommendation.getSubscriber().getId() : null)
                .subscriberEmail(
                        recommendation.getSubscriber() != null ? recommendation.getSubscriber().getEmail() : null)
                .companyId(companyId)
                .companyName(companyName)
                .jobId(recommendation.getJob() != null ? recommendation.getJob().getId() : null)
                .jobTitle(recommendation.getJob() != null ? recommendation.getJob().getName() : null)
                .matchScore(recommendation.getMatchScore())
                .matchedSkills(matchedSkills)
                .reason(recommendation.getReason())
                .emailStatus(recommendation.getEmailStatus())
                .sentAt(recommendation.getSentAt())
                .createdAt(recommendation.getCreatedAt())
                .build();
    }

    private String toJson(List<String> list) {
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            log.warn("Failed to serialize matched skills list", e);
            return "[]";
        }
    }

    @SuppressWarnings("unchecked")
    private List<String> parseJson(String json) {
        if (json == null || json.isBlank())
            return List.of();
        try {
            return objectMapper.readValue(json, List.class);
        } catch (JsonProcessingException e) {
            // fallback: try parsing as comma separated
            return Arrays.asList(json.replaceAll("[\\[\\]\"]", "").split(","));
        }
    }

    public void reconcilePendingEmails() {
        log.info("Running pending email reconciliation...");
        // Only re-queue records that have been attempted before (retryCount > 0).
        // Fresh records (retryCount = 0) are already in the RabbitMQ queue from the
        // initial publish — we must NOT republish them or they will be sent multiple times.
        // Use a 5-minute cutoff to avoid picking up records mid-processing.
        Instant cutoff = Instant.now().minus(5, ChronoUnit.MINUTES);
        List<JobRecommendation> pending = jobRecommendationRepository.findPendingForReconciliation(cutoff);

        if (pending.isEmpty()) {
            log.info("No failed-retry emails found for reconciliation.");
            return;
        }

        log.info("Found {} failed-retry recommendations for reconciliation. Republishing to RabbitMQ...", pending.size());

        // Group by subscriber
        java.util.Map<Subscriber, List<JobRecommendation>> grouped = pending.stream()
                .collect(Collectors.groupingBy(JobRecommendation::getSubscriber));

        for (java.util.Map.Entry<Subscriber, List<JobRecommendation>> entry : grouped.entrySet()) {
            Subscriber sub = entry.getKey();
            List<Long> ids = entry.getValue().stream()
                    .map(JobRecommendation::getId)
                    .collect(Collectors.toList());

            RecommendationEmailMessage msg = RecommendationEmailMessage.builder()
                    .subscriberId(sub.getId())
                    .subscriberEmail(sub.getEmail())
                    .subscriberName(null)
                    .recommendationIds(ids)
                    .build();

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.EXCHANGE_RECOMMENDATION_EMAIL,
                    RabbitMQConfig.ROUTING_KEY_RECOMMENDATION_EMAIL,
                    msg
            );
            log.info("Republished failed-retry email to RabbitMQ for: {}", sub.getEmail());
        }
    }
}
