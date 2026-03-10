package vn.phantruongan.backend.cronjob;

import java.util.concurrent.ScheduledFuture;

import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.phantruongan.backend.cronjob.entities.CronJob;
import vn.phantruongan.backend.cronjob.services.CronJobService;
import vn.phantruongan.backend.recommendation.services.JobRecommendationService;
import vn.phantruongan.backend.recommendation.services.RecommendationConfigUpdatedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class JobRecommendationScheduler implements SchedulingConfigurer {

    private final JobRecommendationService recommendationService;
    private final CronJobService cronJobService;
    private ScheduledTaskRegistrar taskRegistrar;
    private ScheduledFuture<?> scheduledFuture;

    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        this.taskRegistrar = taskRegistrar;
        updateSchedule();
    }

    @EventListener
    public void handleConfigUpdate(RecommendationConfigUpdatedEvent event) {
        log.info("Received configuration update event, updating schedule...");
        updateSchedule();
    }

    public void updateSchedule() {
        CronJob config = cronJobService.getJobRecommendationConfig();
        
        if (scheduledFuture != null) {
            scheduledFuture.cancel(false);
        }

        if (config.getIsEnabled()) {
            log.info("Scheduling job recommendation with cron: {}", config.getCronExpression());
            scheduledFuture = taskRegistrar.getScheduler().schedule(
                recommendationService::generateJobRecommendations,
                new CronTrigger(config.getCronExpression())
            );
        } else {
            log.info("Job recommendation scheduler is disabled");
        }
    }
}
