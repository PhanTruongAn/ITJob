package vn.phantruongan.backend.recommendation.services;

import java.net.ConnectException;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.springframework.amqp.AmqpRejectAndDontRequeueException;
import org.springframework.amqp.core.MessageDeliveryMode;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.handler.annotation.Header;
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

    static final String HEADER_EMAIL_ATTEMPT = "x-email-attempt";

    private final JobRecommendationRepository jobRecommendationRepository;
    private final EmailService emailService;
    private final JobRecommendationService jobRecommendationService;
    private final EmailSendHistoryRepository emailSendHistoryRepository;
    private final MeterRegistry meterRegistry;
    private final RabbitTemplate rabbitTemplate;

    @Value("${email.backoff-base-ms:1000}")
    private int backoffBaseMs;

    @Value("${email.backoff-max-ms:30000}")
    private int backoffMaxMs;

    @Value("${email.max-retries:3}")
    private int maxRetries;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_RECOMMENDATION_EMAIL)
    public void consumeRecommendationEmail(
            RecommendationEmailMessage message,
            @Header(name = HEADER_EMAIL_ATTEMPT, required = false) Object retryAttemptHeader) {
        log.info("Received recommendation email message from RabbitMQ: {}", message);

        List<Long> recIds = message.getRecommendationIds();
        if (recIds == null || recIds.isEmpty()) {
            log.warn("Received empty recommendation IDs list, skipping.");
            return;
        }

        List<JobRecommendation> recommendations = jobRecommendationRepository.findAllByIdIn(recIds);
        if (recommendations.isEmpty()) {
            log.warn("No JobRecommendations found for IDs {}, skipping.", recIds);
            return;
        }

        List<JobRecommendationResDTO> resDTOs = recommendations.stream()
                .map(jobRecommendationService::convertToResDTO)
                .collect(Collectors.toList());

        int retryCount = recommendations.get(0).getRetryCount() == null
                ? 0
                : recommendations.get(0).getRetryCount();
        int attempt = Math.max(parseAttempt(retryAttemptHeader), retryCount + 1);

        try {
            emailService.sendJobRecommendationsEmail(message.getSubscriberEmail(), null, resDTOs);
            jobRecommendationRepository.updateEmailStatusAndSentAtByIds(recIds, EmailStatus.SENT, Instant.now());

            for (Long recId : recIds) {
                saveHistory(recId, message.getSubscriberEmail(), EmailStatus.SENT, attempt, null);
            }

            meterRegistry.counter("email.sent.total").increment();
            log.info("Successfully processed and sent email to {} (attempt {})",
                    message.getSubscriberEmail(), attempt);
        } catch (Exception e) {
            log.error("Failed to send email to '{}': {}", message.getSubscriberEmail(), e.getMessage());
            handleEmailFailure(message, recIds, attempt, e);
        }
    }

    private void handleEmailFailure(
            RecommendationEmailMessage message,
            List<Long> recIds,
            int attempt,
            Exception failure) {
        if (isTransientException(failure) && attempt < Math.max(1, maxRetries)) {
            long delay = backoffDelayMs(attempt);
            jobRecommendationRepository.updateEmailStatusAndRetryCountByIds(
                    recIds, EmailStatus.PENDING, attempt);

            for (Long recId : recIds) {
                saveHistory(recId, message.getSubscriberEmail(), EmailStatus.PENDING, attempt, failure.getMessage());
            }
            meterRegistry.counter("email.retried.total").increment();

            try {
                publishRetry(message, attempt + 1, delay);
                log.warn("Transient email failure (attempt {}). Retry queued with {}ms TTL. IDs: {}",
                        attempt, delay, recIds);
            } catch (Exception publishFailure) {
                log.error("Failed to enqueue retry for recommendation email IDs {}", recIds, publishFailure);
                throw new AmqpRejectAndDontRequeueException(
                        "Could not enqueue recommendation email retry", publishFailure);
            }
            return;
        }

        int failedRetryCount = attempt;
        if (isTransientException(failure)) {
            log.error("Maximum email attempts reached ({}). Marking FAILED for IDs: {}", maxRetries, recIds);
            jobRecommendationRepository.updateEmailStatusAndRetryCountByIds(
                    recIds, EmailStatus.FAILED, failedRetryCount);
        } else {
            log.error("Permanent email failure. Marking FAILED immediately for IDs: {}", recIds);
            jobRecommendationRepository.updateEmailStatusByIds(recIds, EmailStatus.FAILED);
        }

        for (Long recId : recIds) {
            saveHistory(recId, message.getSubscriberEmail(), EmailStatus.FAILED, attempt, failure.getMessage());
        }
        meterRegistry.counter("email.failed.total").increment();

        // AUTO acknowledgement rejects this message without requeue; the main queue's
        // existing dead-letter binding moves it to the established DLQ.
        throw new AmqpRejectAndDontRequeueException(
                isTransientException(failure)
                        ? "Recommendation email retry attempts exhausted"
                        : "Permanent recommendation email failure",
                failure);
    }

    private void publishRetry(RecommendationEmailMessage message, int nextAttempt, long delayMs) {
        rabbitTemplate.convertAndSend(
                "",
                RabbitMQConfig.QUEUE_RECOMMENDATION_EMAIL_RETRY,
                message,
                outgoing -> {
                    outgoing.getMessageProperties().setHeader(HEADER_EMAIL_ATTEMPT, nextAttempt);
                    outgoing.getMessageProperties().setExpiration(Long.toString(delayMs));
                    outgoing.getMessageProperties().setDeliveryMode(MessageDeliveryMode.PERSISTENT);
                    return outgoing;
                });
    }

    private int parseAttempt(Object retryAttemptHeader) {
        if (retryAttemptHeader instanceof Number number && number.intValue() > 0) {
            return number.intValue();
        }
        if (retryAttemptHeader != null) {
            try {
                return Math.max(1, Integer.parseInt(retryAttemptHeader.toString()));
            } catch (NumberFormatException ignored) {
                log.warn("Ignoring invalid email attempt header: {}", retryAttemptHeader);
            }
        }
        return 1;
    }

    private long backoffDelayMs(int failedAttempt) {
        long cap = Math.max(1, backoffMaxMs);
        long delay = Math.max(1, Math.min(backoffBaseMs, cap));
        for (int retry = 1; retry < failedAttempt && delay < cap; retry++) {
            delay = delay > cap / 2 ? cap : Math.min(delay * 2, cap);
        }
        return delay;
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
            log.error("Failed to save EmailSendHistory for recommendationId={}: {}",
                    recommendationId, ex.getMessage());
        }
    }

    private boolean isTransientException(Throwable throwable) {
        Throwable current = throwable;
        while (current != null) {
            String className = current.getClass().getName();
            if (current instanceof SocketTimeoutException
                    || current instanceof ConnectException
                    || current instanceof UnknownHostException
                    || className.contains("MailConnectException")
                    || className.contains("SocketException")) {
                return true;
            }

            if (className.contains("SMTPSendFailedException")) {
                try {
                    int code = (Integer) current.getClass().getMethod("getReturnCode").invoke(current);
                    if (code == 421 || code == 450 || code == 451 || code == 452) {
                        return true;
                    }
                } catch (Exception ignored) {
                    // Fall through to the existing message-based compatibility check.
                }
            }

            String message = current.getMessage();
            if (message != null) {
                String normalized = message.toLowerCase(Locale.ROOT);
                if (message.contains("421") || message.contains("450") || message.contains("451")
                        || message.contains("452") || normalized.contains("timeout")
                        || normalized.contains("connection reset")) {
                    return true;
                }
            }
            current = current.getCause();
        }
        return false;
    }
}
