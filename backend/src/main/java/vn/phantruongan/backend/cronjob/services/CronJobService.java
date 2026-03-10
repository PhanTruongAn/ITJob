package vn.phantruongan.backend.cronjob.services;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import vn.phantruongan.backend.cronjob.entities.CronJob;
import vn.phantruongan.backend.cronjob.repositories.CronJobRepository;
import vn.phantruongan.backend.recommendation.services.RecommendationConfigUpdatedEvent;

@Service
@RequiredArgsConstructor
public class CronJobService {

    private final CronJobRepository cronJobRepository;
    private final ApplicationEventPublisher eventPublisher;

    public static final String JOB_RECOMMENDATION_NAME = "JOB_RECOMMENDATION";

    public CronJob getJobRecommendationConfig() {
        return cronJobRepository.findByName(JOB_RECOMMENDATION_NAME)
                .orElseGet(this::createDefaultJobRecommendationConfig);
    }

    public CronJob updateJobRecommendationConfig(CronJob newConfig) {
        CronJob currentConfig = getJobRecommendationConfig();
        currentConfig.setCronExpression(newConfig.getCronExpression());
        currentConfig.setIsEnabled(newConfig.getIsEnabled());
        currentConfig.setMinMatchPercentage(newConfig.getMinMatchPercentage());
        currentConfig.setOnlyLast24h(newConfig.getOnlyLast24h());
        currentConfig.setMaxJobsPerSubscriber(newConfig.getMaxJobsPerSubscriber());
        
        CronJob saved = cronJobRepository.save(currentConfig);
        
        // Notify scheduler (using old event for now to avoid breaking things, will rename later)
        eventPublisher.publishEvent(new RecommendationConfigUpdatedEvent(this, null)); 
        
        return saved;
    }

    private CronJob createDefaultJobRecommendationConfig() {
        CronJob config = CronJob.builder()
                .name(JOB_RECOMMENDATION_NAME)
                .cronExpression("0 45 20 * * ?")
                .isEnabled(true)
                .minMatchPercentage(60)
                .onlyLast24h(true)
                .maxJobsPerSubscriber(10)
                .build();
        return cronJobRepository.save(config);
    }
}
