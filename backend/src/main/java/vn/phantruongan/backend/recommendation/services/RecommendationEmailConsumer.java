package vn.phantruongan.backend.recommendation.services;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.phantruongan.backend.common.email.EmailService;
import vn.phantruongan.backend.config.common.RabbitMQConfig;
import vn.phantruongan.backend.recommendation.dtos.RecommendationEmailMessage;
import vn.phantruongan.backend.recommendation.dtos.res.JobRecommendationResDTO;
import vn.phantruongan.backend.recommendation.entities.EmailSendHistory;
import vn.phantruongan.backend.recommendation.entities.JobRecommendation;
import vn.phantruongan.backend.recommendation.enums.EmailStatus;
import vn.phantruongan.backend.recommendation.repositories.EmailSendHistoryRepository;
import vn.phantruongan.backend.recommendation.repositories.JobRecommendationRepository;

@Component
@RequiredArgsConstructor
@Slf4j
public class RecommendationEmailConsumer {

    private final JobRecommendationRepository jobRecommendationRepository;
    private final EmailService emailService;
    private final JobRecommendationService jobRecommendationService;
    private final EmailSendHistoryRepository emailSendHistoryRepository;
    private final MeterRegistry meterRegistry;

    @Value("${email.backoff-base-ms:1000}")
    private int backoffBaseMs;

    @Value("${email.backoff-max-ms:30000}")
    private int backoffMaxMs;

    @Value("${email.max-retries:3}")
    private int maxRetries;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_RECOMMENDATION_EMAIL)
    public void consumeRecommendationEmail(RecommendationEmailMessage message) {
        log.info("Received recommendation email message from RabbitMQ: {}", message);

        List<Long> recIds = message.getRecommendationIds();
        if (recIds == null || recIds.isEmpty()) {
            log.warn("Received empty recommendation IDs list, skipping.");
            return;
        }

        // Fetch current recommendations from DB using eager loading (@EntityGraph)
        List<JobRecommendation> recommendations = jobRecommendationRepository.findAllByIdIn(recIds);
        if (recommendations.isEmpty()) {
            log.warn("No JobRecommendations found for IDs {}, skipping.", recIds);
            return;
        }

        // Map to ResDTO for template processing
        List<JobRecommendationResDTO> resDTOs = recommendations.stream()
                .map(jobRecommendationService::convertToResDTO)
                .collect(Collectors.toList());

        int attempt = (recommendations.get(0).getRetryCount() != null
                ? recommendations.get(0).getRetryCount()
                : 0) + 1;

        try {
            // Send email synchronously
            emailService.sendJobRecommendationsEmail(
                    message.getSubscriberEmail(),
                    null,
                    resDTOs
            );

            // On success, update status in DB
            jobRecommendationRepository.updateEmailStatusAndSentAtByIds(recIds, EmailStatus.SENT, Instant.now());

            // Log send history for each recommendation
            for (Long recId : recIds) {
                saveHistory(recId, message.getSubscriberEmail(), EmailStatus.SENT, attempt, null);
            }

            meterRegistry.counter("email.sent.total").increment();
            log.info("Successfully processed and sent email to {} (attempt {})", message.getSubscriberEmail(), attempt);

        } catch (Exception e) {
            log.error("Failed to send email to '{}': {}", message.getSubscriberEmail(), e.getMessage());
            handleEmailFailure(recIds, recommendations, message.getSubscriberEmail(), attempt, e);
        } finally {
            // Rate-limit throttling: ~1000 emails/minute
            try {
                Thread.sleep(70);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                log.warn("Throttle sleep interrupted", ie);
            }
        }
    }

    private void handleEmailFailure(
            List<Long> recIds,
            List<JobRecommendation> recommendations,
            String subscriberEmail,
            int attempt,
            Exception e) {

        boolean isTransient = isTransientException(e);
        int currentRetry = recommendations.get(0).getRetryCount() != null
                ? recommendations.get(0).getRetryCount()
                : 0;
        int newRetryCount = currentRetry + 1;

        if (isTransient && newRetryCount < maxRetries) {
            // Exponential back-off: min(baseMs * 2^(attempt-1), maxMs)
            long delay = Math.min((long) backoffBaseMs * (1L << (newRetryCount - 1)), backoffMaxMs);
            log.warn("Transient failure (attempt {}). Back-off {}ms before next retry. IDs: {}", newRetryCount, delay, recIds);
            try {
                Thread.sleep(delay);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                log.warn("Back-off sleep interrupted", ie);
            }

            // Keep PENDING, increment retryCount – reconciliation job will re-queue
            jobRecommendationRepository.updateEmailStatusAndRetryCountByIds(recIds, EmailStatus.PENDING, newRetryCount);

            // Log failed attempt
            for (Long recId : recIds) {
                saveHistory(recId, subscriberEmail, EmailStatus.PENDING, attempt, e.getMessage());
            }
            meterRegistry.counter("email.retried.total").increment();

        } else {
            // Permanent failure OR max retries exhausted
            if (isTransient) {
                log.error("Max transient retries reached ({}). Marking FAILED for IDs: {}", maxRetries, recIds);
                jobRecommendationRepository.updateEmailStatusAndRetryCountByIds(recIds, EmailStatus.FAILED, newRetryCount);
            } else {
                log.error("Permanent (non-transient) failure. Marking FAILED immediately for IDs: {}", recIds);
                jobRecommendationRepository.updateEmailStatusByIds(recIds, EmailStatus.FAILED);
            }

            // Log failure history for each recommendation
            for (Long recId : recIds) {
                saveHistory(recId, subscriberEmail, EmailStatus.FAILED, attempt, e.getMessage());
            }
            meterRegistry.counter("email.failed.total").increment();
        }
    }

    private void saveHistory(Long recommendationId, String email, EmailStatus status, int attempt, String errorMessage) {
        try {
            EmailSendHistory history = EmailSendHistory.builder()
                    .recommendationId(recommendationId)
                    .email(email)
                    .status(status)
                    .attempt(attempt)
                    .createdAt(Instant.now())
                    .errorMessage(errorMessage)
                    .build();
            emailSendHistoryRepository.save(history);
        } catch (Exception ex) {
            log.error("Failed to save EmailSendHistory for recommendationId={}: {}", recommendationId, ex.getMessage());
        }
    }

    private boolean isTransientException(Throwable throwable) {
        if (throwable == null) return false;

        Throwable current = throwable;
        while (current != null) {
            String className = current.getClass().getName();
            if (current instanceof java.net.SocketTimeoutException ||
                current instanceof java.net.ConnectException ||
                current instanceof java.net.UnknownHostException ||
                className.contains("MailConnectException") ||
                className.contains("SocketException")) {
                return true;
            }

            if (className.contains("SMTPSendFailedException")) {
                try {
                    java.lang.reflect.Method getReturnCode = current.getClass().getMethod("getReturnCode");
                    int code = (Integer) getReturnCode.invoke(current);
                    if (code == 421 || code == 450 || code == 451 || code == 452) {
                        return true;
                    }
                } catch (Exception ex) {
                    // ignore, fallback to message check
                }
            }

            String msg = current.getMessage();
            if (msg != null) {
                if (msg.contains("421") || msg.contains("450") || msg.contains("451") || msg.contains("452") ||
                    msg.toLowerCase().contains("timeout") || msg.toLowerCase().contains("connection reset")) {
                    return true;
                }
            }

            current = current.getCause();
        }
        return false;
    }
}
