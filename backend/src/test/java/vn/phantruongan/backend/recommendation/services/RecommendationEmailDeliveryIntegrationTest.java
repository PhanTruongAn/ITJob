package vn.phantruongan.backend.recommendation.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import vn.phantruongan.backend.recommendation.entities.RecommendationEmailDelivery;
import vn.phantruongan.backend.recommendation.entities.JobRecommendation;
import vn.phantruongan.backend.recommendation.enums.EmailDeliveryClaimResult;
import vn.phantruongan.backend.recommendation.enums.EmailDeliveryStatus;
import vn.phantruongan.backend.recommendation.enums.EmailStatus;
import vn.phantruongan.backend.recommendation.repositories.EmailSendHistoryRepository;
import vn.phantruongan.backend.recommendation.repositories.JobRecommendationRepository;
import vn.phantruongan.backend.recommendation.repositories.RecommendationEmailDeliveryRepository;

@SpringBootTest
class RecommendationEmailDeliveryIntegrationTest {

    @Autowired
    private RecommendationEmailDeliveryRepository deliveryRepository;

    @Autowired
    private RecommendationEmailDeliveryService deliveryService;

    @Autowired
    private JobRecommendationRepository jobRecommendationRepository;

    @Autowired
    private EmailSendHistoryRepository emailSendHistoryRepository;

    @Test
    void databaseUniqueIdentityAllowsOnlyOneConcurrentClaim() throws Exception {
        String identity = "integration:" + UUID.randomUUID();
        CountDownLatch ready = new CountDownLatch(2);
        CountDownLatch start = new CountDownLatch(1);
        ExecutorService executor = Executors.newFixedThreadPool(2);
        List<Future<EmailDeliveryClaimResult>> claims = new ArrayList<>();

        try {
            for (int i = 0; i < 2; i++) {
                claims.add(executor.submit(() -> {
                    ready.countDown();
                    if (!start.await(10, TimeUnit.SECONDS)) {
                        throw new IllegalStateException("concurrent claim start timed out");
                    }
                    return deliveryService.claim(identity, 1);
                }));
            }
            assertTrue(ready.await(10, TimeUnit.SECONDS));
            start.countDown();

            List<EmailDeliveryClaimResult> results = List.of(
                    claims.get(0).get(20, TimeUnit.SECONDS), claims.get(1).get(20, TimeUnit.SECONDS));
            assertEquals(1, results.stream().filter(result -> result == EmailDeliveryClaimResult.CLAIMED).count());
            assertEquals(1, results.stream().filter(result -> result == EmailDeliveryClaimResult.IN_PROGRESS).count());
            assertEquals(1, deliveryRepository.countByDeliveryIdentity(identity));
        } finally {
            start.countDown();
            executor.shutdownNow();
            deliveryRepository.deleteByDeliveryIdentity(identity);
        }
    }

    @Test
    void explicitPendingResetAllowsManualReplayWithTheSameIdentity() {
        String identity = "manual-replay:" + UUID.randomUUID();
        try {
            assertEquals(EmailDeliveryClaimResult.CLAIMED, deliveryService.claim(identity, 1));
            RecommendationEmailDelivery delivery = deliveryRepository.findByDeliveryIdentity(identity).orElseThrow();
            delivery.setStatus(EmailDeliveryStatus.FAILED);
            deliveryRepository.saveAndFlush(delivery);

            assertEquals(EmailDeliveryClaimResult.FAILED, deliveryService.claim(identity, 2));

            delivery.setStatus(EmailDeliveryStatus.PENDING);
            deliveryRepository.saveAndFlush(delivery);
            assertEquals(EmailDeliveryClaimResult.CLAIMED, deliveryService.claim(identity, 2));
            assertEquals(1, deliveryRepository.countByDeliveryIdentity(identity));
        } finally {
            deliveryRepository.deleteByDeliveryIdentity(identity);
        }
    }

    @Test
    void retryPublicationFailureCannotOverwriteAConcurrentProcessingClaim() {
        String identity = "conditional-failure:" + UUID.randomUUID();
        try {
            assertEquals(EmailDeliveryClaimResult.CLAIMED, deliveryService.claim(identity, 1));
            RecommendationEmailDelivery delivery = deliveryRepository.findByDeliveryIdentity(identity).orElseThrow();
            delivery.setStatus(EmailDeliveryStatus.PENDING);
            deliveryRepository.saveAndFlush(delivery);

            assertEquals(EmailDeliveryClaimResult.CLAIMED, deliveryService.claim(identity, 2));
            deliveryService.markRetryPublicationFailed(identity, "retry-publication-failure", "test failure");

            assertEquals(EmailDeliveryStatus.PROCESSING,
                    deliveryRepository.findByDeliveryIdentity(identity).orElseThrow().getStatus());
        } finally {
            deliveryRepository.deleteByDeliveryIdentity(identity);
        }
    }

    @Test
    void sentStateRecommendationAndHistoryCommitTogether() {
        String identity = "atomic-success:" + UUID.randomUUID();
        JobRecommendation recommendation = jobRecommendationRepository.saveAndFlush(new JobRecommendation());
        Long recommendationId = recommendation.getId();
        try {
            assertEquals(EmailDeliveryClaimResult.CLAIMED, deliveryService.claim(identity, 1));
            deliveryService.markSent(identity, List.of(recommendationId), "candidate@example.test", 1);

            assertEquals(EmailDeliveryStatus.SENT,
                    deliveryRepository.findByDeliveryIdentity(identity).orElseThrow().getStatus());
            assertEquals(EmailStatus.SENT,
                    jobRecommendationRepository.findById(recommendationId).orElseThrow().getEmailStatus());
            assertEquals(1, emailSendHistoryRepository.countByRecommendationId(recommendationId));
        } finally {
            emailSendHistoryRepository.deleteAll(emailSendHistoryRepository.findAll().stream()
                    .filter(history -> history.getRecommendationId().equals(recommendationId)).toList());
            deliveryRepository.deleteByDeliveryIdentity(identity);
            jobRecommendationRepository.deleteById(recommendationId);
        }
    }

    @Test
    void historyPersistenceFailureRollsBackSentDeliveryAndRecommendationState() {
        String identity = "atomic-failure:" + UUID.randomUUID();
        JobRecommendation recommendation = jobRecommendationRepository.saveAndFlush(new JobRecommendation());
        Long recommendationId = recommendation.getId();
        try {
            assertEquals(EmailDeliveryClaimResult.CLAIMED, deliveryService.claim(identity, 1));

            assertThrows(RuntimeException.class,
                    () -> deliveryService.markSent(identity, List.of(recommendationId), null, 1));

            assertEquals(EmailDeliveryStatus.PROCESSING,
                    deliveryRepository.findByDeliveryIdentity(identity).orElseThrow().getStatus());
            assertEquals(EmailStatus.PENDING,
                    jobRecommendationRepository.findById(recommendationId).orElseThrow().getEmailStatus());
            assertEquals(0, emailSendHistoryRepository.countByRecommendationId(recommendationId));
        } finally {
            emailSendHistoryRepository.deleteAll(emailSendHistoryRepository.findAll().stream()
                    .filter(history -> history.getRecommendationId().equals(recommendationId)).toList());
            deliveryRepository.deleteByDeliveryIdentity(identity);
            jobRecommendationRepository.deleteById(recommendationId);
        }
    }
}
