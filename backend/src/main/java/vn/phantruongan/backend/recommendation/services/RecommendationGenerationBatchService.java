package vn.phantruongan.backend.recommendation.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.cronjob.entities.CronJob;
import vn.phantruongan.backend.follow.repositories.CompanyFollowRepository;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.recommendation.dtos.RecommendationEmailMessage;
import vn.phantruongan.backend.recommendation.entities.JobRecommendation;
import vn.phantruongan.backend.recommendation.enums.EmailStatus;
import vn.phantruongan.backend.recommendation.enums.RecommendationStatus;
import vn.phantruongan.backend.recommendation.repositories.JobRecommendationRepository;
import vn.phantruongan.backend.outbox.services.OutboxEventService;
import vn.phantruongan.backend.subscriber.entities.Subscriber;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationGenerationBatchService {

    private final JobRecommendationRepository jobRecommendationRepository;
    private final CompanyFollowRepository companyFollowRepository;
    private final OutboxEventService outboxEventService;
    private final ObjectMapper objectMapper;

    /**
     * Persists the recommendations and their email event records in one transaction.
     * This method is invoked through the Spring-managed service proxy by
     * {@link JobRecommendationService}.
     */
    @Transactional
    public int createRecommendationsForBatch(List<Subscriber> subscribers, List<Job> jobs, CronJob config) {
        List<JobRecommendation> toSave = new ArrayList<>();

        for (Subscriber subscriber : subscribers) {
            long existingPending = jobRecommendationRepository.countBySubscriber_IdAndStatus(
                    subscriber.getId(), RecommendationStatus.PENDING);

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
                if (addedCount >= canAdd) {
                    break;
                }

                if (Boolean.TRUE.equals(config.getSkipDuplicates())
                        && jobRecommendationRepository.existsBySubscriber_IdAndJob_Id(
                                subscriber.getId(), job.getId())) {
                    continue;
                }

                Set<Long> jobSkillIds = job.getJobSkills()
                        .stream()
                        .map(js -> js.getSkill().getId())
                        .collect(Collectors.toSet());

                if (jobSkillIds.isEmpty()) {
                    continue;
                }

                double score = calculateWeightedScore(
                        subscriberSkillIds, jobSkillIds, job.getCompany(), followedCompanyIdSet, config);
                if (score < config.getMinMatchPercentage()) {
                    continue;
                }

                List<String> matchedSkillNames = job.getJobSkills()
                        .stream()
                        .filter(js -> subscriberSkillIds.contains(js.getSkill().getId()))
                        .map(js -> js.getSkill().getName())
                        .toList();

                String reason = String.format(
                        "Matched %d/%d required skills", matchedSkillNames.size(), jobSkillIds.size());
                if (job.getCompany() != null && followedCompanyIdSet.contains(job.getCompany().getId())) {
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
                log.info("Generated {} recommendations for subscriber {}", addedCount, subscriber.getEmail());
            }
        }

        if (toSave.isEmpty()) {
            return 0;
        }

        List<JobRecommendation> saved = jobRecommendationRepository.saveAll(toSave);
        log.info("Saved {} recommendations.", saved.size());

        java.util.Map<Subscriber, List<JobRecommendation>> grouped = saved.stream()
                .collect(Collectors.groupingBy(JobRecommendation::getSubscriber));
        List<RecommendationEmailMessage> messages = new ArrayList<>(grouped.size());

        for (java.util.Map.Entry<Subscriber, List<JobRecommendation>> entry : grouped.entrySet()) {
            Subscriber subscriber = entry.getKey();
            List<Long> recommendationIds = entry.getValue().stream()
                    .map(JobRecommendation::getId)
                    .collect(Collectors.toList());

            messages.add(RecommendationEmailMessage.builder()
                    .subscriberId(subscriber.getId())
                    .subscriberEmail(subscriber.getEmail())
                    .subscriberName(null)
                    .recommendationIds(recommendationIds)
                    .build());
        }

        outboxEventService.saveRecommendationEmailEvents(messages);
        return saved.size();
    }

    private double calculateWeightedScore(
            Set<Long> subscriberSkillIds,
            Set<Long> jobSkillIds,
            Company company,
            Set<Long> followedCompanyIds,
            CronJob config) {

        double score = 0.0;
        int totalWeight = config.getSkillMatchWeight()
                + config.getCompanyFollowWeight()
                + config.getIndustryWeight()
                + config.getLocationWeight()
                + config.getSalaryWeight();
        if (totalWeight == 0) {
            totalWeight = 100;
        }

        long matchingCount = jobSkillIds.stream().filter(subscriberSkillIds::contains).count();
        double skillMatchRatio = (double) matchingCount / jobSkillIds.size();
        score += skillMatchRatio * config.getSkillMatchWeight();

        if (company != null && followedCompanyIds.contains(company.getId())) {
            score += config.getCompanyFollowWeight();
        }

        return (score / totalWeight) * 100.0;
    }

    private String toJson(List<String> list) {
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            log.warn("Failed to serialize matched skills list", e);
            return "[]";
        }
    }
}
