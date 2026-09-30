package vn.phantruongan.backend.recommendation.services;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.recommendation.entities.EmailSendHistory;
import vn.phantruongan.backend.recommendation.entities.RecommendationEmailDelivery;
import vn.phantruongan.backend.recommendation.enums.EmailDeliveryStatus;
import vn.phantruongan.backend.recommendation.enums.EmailDeliveryClaimResult;
import vn.phantruongan.backend.recommendation.enums.EmailStatus;
import vn.phantruongan.backend.recommendation.repositories.EmailSendHistoryRepository;
import vn.phantruongan.backend.recommendation.repositories.JobRecommendationRepository;
import vn.phantruongan.backend.recommendation.repositories.RecommendationEmailDeliveryRepository;

@Service
@RequiredArgsConstructor
public class RecommendationEmailDeliveryService {

    private final RecommendationEmailDeliveryRepository deliveryRepository;
    private final JobRecommendationRepository jobRecommendationRepository;
    private final EmailSendHistoryRepository emailSendHistoryRepository;

    @Transactional
    public EmailDeliveryClaimResult claim(String identity, int attempt) {
        if (deliveryRepository.insertProcessingIfAbsent(identity, attempt) == 1
                || deliveryRepository.claimPending(identity, attempt) == 1) {
            return EmailDeliveryClaimResult.CLAIMED;
        }
        return deliveryRepository.findByDeliveryIdentity(identity)
                .map(RecommendationEmailDelivery::getStatus)
                .map(status -> switch (status) {
                    case PROCESSING -> EmailDeliveryClaimResult.IN_PROGRESS;
                    case SENT -> EmailDeliveryClaimResult.SENT;
                    case FAILED -> EmailDeliveryClaimResult.FAILED;
                    case PENDING -> EmailDeliveryClaimResult.PENDING;
                })
                .orElseThrow(() -> new IllegalStateException("Delivery claim disappeared: " + identity));
    }

    @Transactional
    public void markSent(String identity, List<Long> recommendationIds, String email, int attempt) {
        RecommendationEmailDelivery delivery = processingDelivery(identity);
        Instant now = Instant.now();
        delivery.setStatus(EmailDeliveryStatus.SENT);
        delivery.setAttempt(attempt);
        delivery.setSentAt(now);
        delivery.setUpdatedAt(now);
        delivery.setFailureCategory(null);
        delivery.setFailureReason(null);
        jobRecommendationRepository.updateEmailStatusAndSentAtByIds(recommendationIds, EmailStatus.SENT, now);
        saveHistory(recommendationIds, email, EmailStatus.SENT, attempt, null, now);
    }

    @Transactional
    public void markRetryPending(
            String identity,
            List<Long> recommendationIds,
            String email,
            int attempt,
            String failureCategory,
            String failureReason) {
        RecommendationEmailDelivery delivery = processingDelivery(identity);
        delivery.setStatus(EmailDeliveryStatus.PENDING);
        delivery.setAttempt(attempt);
        delivery.setUpdatedAt(Instant.now());
        delivery.setFailureCategory(failureCategory);
        delivery.setFailureReason(failureReason);
        jobRecommendationRepository.updateEmailStatusAndRetryCountByIds(
                recommendationIds, EmailStatus.PENDING, attempt);
        saveHistory(recommendationIds, email, EmailStatus.PENDING, attempt, failureReason, Instant.now());
    }

    @Transactional
    public void markFailed(
            String identity,
            List<Long> recommendationIds,
            String email,
            int attempt,
            boolean exhaustedRetry,
            String failureCategory,
            String failureReason) {
        RecommendationEmailDelivery delivery = processingDelivery(identity);
        delivery.setStatus(EmailDeliveryStatus.FAILED);
        delivery.setAttempt(attempt);
        delivery.setUpdatedAt(Instant.now());
        delivery.setFailureCategory(failureCategory);
        delivery.setFailureReason(failureReason);
        if (exhaustedRetry) {
            jobRecommendationRepository.updateEmailStatusAndRetryCountByIds(
                    recommendationIds, EmailStatus.FAILED, attempt);
        } else {
            jobRecommendationRepository.updateEmailStatusByIds(recommendationIds, EmailStatus.FAILED);
        }
        saveHistory(recommendationIds, email, EmailStatus.FAILED, attempt, failureReason, Instant.now());
    }

    @Transactional
    public void markRetryPublicationFailed(String identity, String failureCategory, String failureReason) {
        deliveryRepository.failPending(identity, failureCategory, failureReason);
    }

    private RecommendationEmailDelivery processingDelivery(String identity) {
        RecommendationEmailDelivery delivery = deliveryRepository.findByDeliveryIdentity(identity)
                .orElseThrow(() -> new IllegalStateException("Delivery not found: " + identity));
        if (delivery.getStatus() != EmailDeliveryStatus.PROCESSING) {
            throw new IllegalStateException("Delivery is not owned for processing: " + identity);
        }
        return delivery;
    }

    private void saveHistory(
            List<Long> recommendationIds,
            String email,
            EmailStatus status,
            int attempt,
            String error,
            Instant createdAt) {
        recommendationIds.forEach(recommendationId -> emailSendHistoryRepository.save(EmailSendHistory.builder()
                .recommendationId(recommendationId)
                .email(email)
                .status(status)
                .attempt(attempt)
                .createdAt(createdAt)
                .errorMessage(error)
                .build()));
    }
}
