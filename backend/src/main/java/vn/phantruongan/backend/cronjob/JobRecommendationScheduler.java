package vn.phantruongan.backend.cronjob;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.recommendation.services.JobRecommendationService;

@Component
@RequiredArgsConstructor
public class JobRecommendationScheduler {

    private final JobRecommendationService recommendationService;

    @Scheduled(cron = "0 45 20 * * ?")
    public void runJobRecommendation() {
        recommendationService.generateJobRecommendations();
    }
}
