package vn.phantruongan.backend.cronjob.services;

import java.util.List;
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

    public synchronized CronJob getJobRecommendationConfig() {
        List<CronJob> configs = cronJobRepository.findAllByName(JOB_RECOMMENDATION_NAME);
        if (configs.isEmpty()) {
            return createDefaultJobRecommendationConfig();
        }
        if (configs.size() > 1) {
            CronJob keep = configs.get(0);
            for (int i = 1; i < configs.size(); i++) {
                cronJobRepository.delete(configs.get(i));
            }
            return keep;
        }
        return configs.get(0);
    }

    public CronJob updateJobRecommendationConfig(CronJob newConfig) {
        CronJob currentConfig = getJobRecommendationConfig();

        // Scheduling
        currentConfig.setCronExpression(newConfig.getCronExpression());
        currentConfig.setIsEnabled(newConfig.getIsEnabled());

        // Rules
        currentConfig.setMinMatchPercentage(newConfig.getMinMatchPercentage());
        currentConfig.setOnlyLast24h(newConfig.getOnlyLast24h());
        currentConfig.setMaxJobsPerSubscriber(newConfig.getMaxJobsPerSubscriber());
        currentConfig.setSkipExpiredJobs(newConfig.getSkipExpiredJobs());
        currentConfig.setSkipInactiveJobs(newConfig.getSkipInactiveJobs());
        currentConfig.setSkipAppliedJobs(newConfig.getSkipAppliedJobs());
        currentConfig.setSkipDuplicates(newConfig.getSkipDuplicates());

        // Strategy weights
        currentConfig.setSkillMatchWeight(newConfig.getSkillMatchWeight());
        currentConfig.setCompanyFollowWeight(newConfig.getCompanyFollowWeight());
        currentConfig.setIndustryWeight(newConfig.getIndustryWeight());
        currentConfig.setLocationWeight(newConfig.getLocationWeight());
        currentConfig.setSalaryWeight(newConfig.getSalaryWeight());

        CronJob saved = cronJobRepository.save(currentConfig);

        // Notify scheduler to refresh cron expression
        eventPublisher.publishEvent(new RecommendationConfigUpdatedEvent(this, null));

        return saved;
    }

    private CronJob createDefaultJobRecommendationConfig() {
        CronJob config = CronJob.builder()
                .name(JOB_RECOMMENDATION_NAME)
                .cronExpression("0 45 20 * * ?")
                .isEnabled(true)
                // Rules
                .minMatchPercentage(60)
                .onlyLast24h(true)
                .maxJobsPerSubscriber(10)
                .skipExpiredJobs(true)
                .skipInactiveJobs(true)
                .skipAppliedJobs(false)
                .skipDuplicates(true)
                // Weights (default total = 100)
                .skillMatchWeight(60)
                .companyFollowWeight(15)
                .industryWeight(10)
                .locationWeight(10)
                .salaryWeight(5)
                .build();
        return cronJobRepository.save(config);
    }
}
