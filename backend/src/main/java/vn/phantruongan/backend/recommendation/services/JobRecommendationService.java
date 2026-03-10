package vn.phantruongan.backend.recommendation.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.job.repositories.JobRepository;
import vn.phantruongan.backend.recommendation.dtos.res.JobRecommendationResDTO;
import vn.phantruongan.backend.recommendation.entities.JobRecommendation;
import vn.phantruongan.backend.recommendation.enums.RecommendationStatus;
import vn.phantruongan.backend.recommendation.repositories.JobRecommendationRepository;
import vn.phantruongan.backend.cronjob.entities.CronJob;
import vn.phantruongan.backend.cronjob.services.CronJobService;
import vn.phantruongan.backend.subscriber.entities.Subscriber;
import vn.phantruongan.backend.subscriber.repositories.SubscriberRepository;
import vn.phantruongan.backend.util.error.InvalidException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobRecommendationService {

    private final JobRecommendationRepository jobRecommendationRepository;
    private final JobRepository jobRepository;
    private final SubscriberRepository subscriberRepository;
    private final CronJobService cronJobService;

    public PaginationResponse<JobRecommendationResDTO> getAllJobRecommendations(Long subscriberId, Pageable pageable) {
        Page<JobRecommendation> page = subscriberId != null
                ? jobRecommendationRepository.findAllBySubscriberId(subscriberId, pageable)
                : jobRecommendationRepository.findAll(pageable);

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

    private JobRecommendationResDTO convertToResDTO(JobRecommendation recommendation) {
        return JobRecommendationResDTO.builder()
                .id(recommendation.getId())
                .subscriberEmail(recommendation.getSubscriber().getEmail())
                .jobTitle(recommendation.getJob().getName())
                .status(recommendation.getStatus())
                .createdAt(recommendation.getCreatedAt())
                .build();
    }

    public JobRecommendationResDTO updateStatus(Long id, RecommendationStatus status) throws InvalidException {
        JobRecommendation recommendation = jobRecommendationRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Không tìm thấy gợi ý công việc"));
        recommendation.setStatus(status);
        return convertToResDTO(jobRecommendationRepository.save(recommendation));
    }

    public void deleteJobRecommendation(Long id) throws InvalidException {
        if (!jobRecommendationRepository.existsById(id)) {
            throw new InvalidException("Không tìm thấy gợi ý công việc");
        }
        jobRecommendationRepository.deleteById(id);
    }

    public void generateJobRecommendations() {
        CronJob config = cronJobService.getJobRecommendationConfig();
        if (!config.getIsEnabled()) {
            log.info("Job recommendation engine is disabled.");
            return;
        }

        log.info("Starting job recommendation generation...");

        List<Subscriber> subscribers = subscriberRepository.findAllWithSkills();
        List<Job> jobs = jobRepository.findAllWithSkills();

        log.info("Loaded {} subscribers and {} jobs for recommendation.", subscribers.size(), jobs.size());

        // 1. Filter jobs by 24h if enabled
        if (config.getOnlyLast24h()) {
            Instant dayAgo = Instant.now().minus(24, ChronoUnit.HOURS);
            jobs = jobs.stream()
                    .filter(j -> j.getCreatedAt() != null && j.getCreatedAt().isAfter(dayAgo))
                    .collect(Collectors.toList());
            log.info("Filtered to {} jobs posted in the last 24h", jobs.size());
        }

        if (subscribers.isEmpty() || jobs.isEmpty()) {
            log.info("No subscribers or jobs to process. Finishing.");
            return;
        }

        // 2. Process subscribers in batches
        int batchSize = 50;
        int batchCount = 0;
        for (int i = 0; i < subscribers.size(); i += batchSize) {
            batchCount++;
            int end = Math.min(i + batchSize, subscribers.size());
            List<Subscriber> batch = subscribers.subList(i, end);
            log.info("Processing batch {} (subscribers {}-{})", batchCount, i + 1, end);
            processSubscriberBatch(batch, jobs, config);
        }

        log.info("Job recommendation generation completed.");
    }

    @Transactional
    public void processSubscriberBatch(List<Subscriber> subscribers, List<Job> jobs, CronJob config) {
        List<JobRecommendation> toSave = new ArrayList<>();

        for (Subscriber subscriber : subscribers) {
            long existingPending = jobRecommendationRepository.countBySubscriber_IdAndStatus(subscriber.getId(),
                    RecommendationStatus.PENDING);
            int canAdd = config.getMaxJobsPerSubscriber() - (int) existingPending;

            if (canAdd <= 0) {
                log.debug("Subscriber {} already has max pending recommendations.", subscriber.getEmail());
                continue;
            }

            Set<Long> subscriberSkillIds = subscriber.getSubscriberSkills()
                    .stream()
                    .map(ss -> ss.getSkill().getId())
                    .collect(Collectors.toSet());

            if (subscriberSkillIds.isEmpty()) {
                log.debug("Subscriber {} has no skills listed.", subscriber.getEmail());
                continue;
            }

            int addedCount = 0;
            for (Job job : jobs) {
                if (addedCount >= canAdd)
                    break;

                Set<Long> jobSkillIds = job.getJobSkills()
                        .stream()
                        .map(js -> js.getSkill().getId())
                        .collect(Collectors.toSet());

                if (jobSkillIds.isEmpty())
                    continue;

                // Calculate match percentage using IDs
                long matchingCount = jobSkillIds.stream().filter(subscriberSkillIds::contains).count();
                double matchPercentage = (double) matchingCount / jobSkillIds.size() * 100;

                if (matchPercentage >= config.getMinMatchPercentage()) {
                    boolean exists = jobRecommendationRepository.existsBySubscriber_IdAndJob_Id(subscriber.getId(),
                            job.getId());
                    if (!exists) {
                        JobRecommendation recommendation = new JobRecommendation();
                        recommendation.setSubscriber(subscriber);
                        recommendation.setJob(job);
                        recommendation.setStatus(RecommendationStatus.PENDING);
                        toSave.add(recommendation);
                        addedCount++;
                    }
                }
            }
            if (addedCount > 0) {
                log.info("Generated {} recommendations for subscriber {}", addedCount, subscriber.getEmail());
            }
        }

        if (!toSave.isEmpty()) {
            jobRecommendationRepository.saveAll(toSave);
            log.info("Saved {} total recommendations for current batch.", toSave.size());
        }
    }
}
