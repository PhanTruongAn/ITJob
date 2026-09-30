package vn.phantruongan.backend.recommendation.services;

import java.net.ConnectException;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import org.springframework.amqp.AmqpRejectAndDontRequeueException;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageDeliveryMode;
import org.springframework.amqp.core.ReturnedMessage;
import org.springframework.amqp.rabbit.connection.CorrelationData;
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
import vn.phantruongan.backend.recommendation.entities.JobRecommendation;
import vn.phantruongan.backend.recommendation.enums.EmailDeliveryClaimResult;
import vn.phantruongan.backend.recommendation.repositories.JobRecommendationRepository;

@Component
@RequiredArgsConstructor
@Slf4j
public class RecommendationEmailConsumer {

    static final String HEADER_EMAIL_ATTEMPT = RabbitMQConfig.HEADER_EMAIL_ATTEMPT;
    private static final Pattern EMAIL_ADDRESS = Pattern.compile(
            "(?i)\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b");

    private final JobRecommendationRepository jobRecommendationRepository;
    private final EmailService emailService;
    private final JobRecommendationService jobRecommendationService;
    private final RecommendationEmailDeliveryService deliveryService;
    private final MeterRegistry meterRegistry;
    private final RabbitTemplate rabbitTemplate;

    @Value("${email.backoff-base-ms:1000}")
    private int backoffBaseMs;

    @Value("${email.backoff-max-ms:30000}")
    private int backoffMaxMs;

    @Value("${email.max-retries:3}")
    private int maxRetries;

    @Value("${outbox.publisher.confirm-timeout-ms:10000}")
    private long publisherConfirmTimeoutMs = 10_000;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_RECOMMENDATION_EMAIL)
    public void consumeRecommendationEmail(
            RecommendationEmailMessage message,
            @Header(name = HEADER_EMAIL_ATTEMPT, required = false) Object retryAttemptHeader,
            Message amqpMessage) {
        String deliveryIdentity = resolveDeliveryIdentity(amqpMessage, message, retryAttemptHeader);
        log.info("Received recommendation email event={}, subscriberId={}, recommendationIds={}",
                header(amqpMessage, RabbitMQConfig.HEADER_OUTBOX_EVENT_ID),
                message == null ? null : message.getSubscriberId(),
                message == null ? null : message.getRecommendationIds());

        if (message == null
                || message.getSubscriberId() == null
                || message.getSubscriberEmail() == null
                || message.getSubscriberEmail().isBlank()
                || message.getRecommendationIds() == null
                || message.getRecommendationIds().isEmpty()
                || message.getRecommendationIds().stream().anyMatch(id -> id == null || id <= 0)) {
            rejectInvalidMessage(amqpMessage, "Missing subscriber, email, or valid recommendation IDs");
        }

        List<Long> recIds = message.getRecommendationIds();

        List<JobRecommendation> recommendations = jobRecommendationRepository.findAllByIdIn(recIds);
        if (recommendations.size() != recIds.size()) {
            rejectInvalidMessage(amqpMessage, "One or more recommendations were not found");
        }
        if (recommendations.stream().anyMatch(recommendation -> recommendation.getSubscriber() == null
                || !message.getSubscriberId().equals(recommendation.getSubscriber().getId()))) {
            rejectInvalidMessage(amqpMessage, "Recommendations do not belong to the supplied subscriber");
        }

        List<JobRecommendationResDTO> resDTOs = recommendations.stream()
                .map(jobRecommendationService::convertToResDTO)
                .collect(Collectors.toList());

        int retryCount = recommendations.get(0).getRetryCount() == null
                ? 0
                : recommendations.get(0).getRetryCount();
        int attempt = Math.max(parseAttempt(retryAttemptHeader), retryCount + 1);
        amqpMessage.getMessageProperties().setHeader(HEADER_EMAIL_ATTEMPT, attempt);

        EmailDeliveryClaimResult claimResult = deliveryService.claim(deliveryIdentity, attempt);
        if (claimResult == EmailDeliveryClaimResult.FAILED) {
            throw new AmqpRejectAndDontRequeueException(
                    "Recommendation email delivery is already failed; route redelivery to the DLQ");
        }
        if (claimResult != EmailDeliveryClaimResult.CLAIMED) {
            log.info("Skipping duplicate recommendation email event={} state={}", deliveryIdentity, claimResult);
            return;
        }

        try {
            emailService.sendJobRecommendationsEmail(message.getSubscriberEmail(), null, resDTOs);
        } catch (Exception e) {
            log.error("Recommendation email processing failed event={} subscriberId={} category={} reason={}",
                    header(amqpMessage, RabbitMQConfig.HEADER_OUTBOX_EVENT_ID),
                    message.getSubscriberId(), failureCategory(e, attempt), safeFailureReason(e));
            handleEmailFailure(message, recIds, attempt, e, amqpMessage, deliveryIdentity);
            return;
        }

        // SMTP must stay outside a database transaction. If this persistence fails after
        // SMTP accepted the message, PROCESSING remains durable and redelivery is skipped.
        deliveryService.markSent(deliveryIdentity, recIds, message.getSubscriberEmail(), attempt);
        meterRegistry.counter("email.sent.total").increment();
        log.info("Successfully sent recommendation email event={} subscriberId={} attempt={}",
                header(amqpMessage, RabbitMQConfig.HEADER_OUTBOX_EVENT_ID), message.getSubscriberId(), attempt);
    }

    private void handleEmailFailure(
            RecommendationEmailMessage message,
            List<Long> recIds,
            int attempt,
            Exception failure,
            Message amqpMessage,
            String deliveryIdentity) {
        if (isTransientException(failure) && attempt < Math.max(1, maxRetries)) {
            long delay = backoffDelayMs(attempt);
            markFailure(amqpMessage, "retryable-email-failure", failure);
            String failureReason = safeFailureReason(failure);
            deliveryService.markRetryPending(deliveryIdentity, recIds, message.getSubscriberEmail(), attempt,
                    "retryable-email-failure", failureReason);
            meterRegistry.counter("email.retried.total").increment();

            try {
                publishRetry(message, amqpMessage, attempt + 1, delay);
                log.warn("Retry queued event={} attempt={} delayMs={} recommendationIds={}",
                        header(amqpMessage, RabbitMQConfig.HEADER_OUTBOX_EVENT_ID), attempt + 1, delay, recIds);
            } catch (Exception publishFailure) {
                markFailure(amqpMessage, "retry-publication-failure", publishFailure);
                deliveryService.markRetryPublicationFailed(deliveryIdentity,
                        "retry-publication-failure", safeFailureReason(publishFailure));
                log.error("Failed to enqueue retry event={} recommendationIds={} reason={}",
                        header(amqpMessage, RabbitMQConfig.HEADER_OUTBOX_EVENT_ID), recIds,
                        safeFailureReason(publishFailure));
                throw new AmqpRejectAndDontRequeueException(
                        "Could not enqueue recommendation email retry", publishFailure);
            }
            return;
        }

        int failedRetryCount = attempt;
        String category = failureCategory(failure, attempt);
        String failureReason = safeFailureReason(failure);
        markFailure(amqpMessage, category, failure);
        if (isTransientException(failure)) {
            log.error("Maximum email attempts reached ({}). Marking FAILED for IDs: {}", maxRetries, recIds);
        } else {
            log.error("Permanent email failure. Marking FAILED immediately for IDs: {}", recIds);
        }
        deliveryService.markFailed(deliveryIdentity, recIds, message.getSubscriberEmail(), failedRetryCount,
                isTransientException(failure), category, failureReason);
        meterRegistry.counter("email.failed.total").increment();

        // AUTO acknowledgement rejects this message without requeue; the main queue's
        // existing dead-letter binding moves it to the established DLQ.
        throw new AmqpRejectAndDontRequeueException(
                isTransientException(failure)
                        ? "Recommendation email retry attempts exhausted"
                        : "Permanent recommendation email failure",
                failure);
    }

    private void publishRetry(
            RecommendationEmailMessage message,
            Message originalMessage,
            int nextAttempt,
            long delayMs) throws Exception {
        var originalProperties = originalMessage.getMessageProperties();
        CorrelationData correlationData = new CorrelationData(
                header(originalMessage, RabbitMQConfig.HEADER_OUTBOX_EVENT_ID)
                        + ":retry:" + nextAttempt + ":" + UUID.randomUUID());
        rabbitTemplate.convertAndSend(
                "",
                RabbitMQConfig.QUEUE_RECOMMENDATION_EMAIL_RETRY,
                message,
                outgoing -> {
                    var properties = outgoing.getMessageProperties();
                    properties.setMessageId(originalProperties.getMessageId());
                    copyHeader(originalProperties, properties, RabbitMQConfig.HEADER_OUTBOX_EVENT_ID);
                    copyHeader(originalProperties, properties, RabbitMQConfig.HEADER_ORIGINAL_ROUTING_KEY);
                    copyHeader(originalProperties, properties, RabbitMQConfig.HEADER_FAILURE_CATEGORY);
                    copyHeader(originalProperties, properties, RabbitMQConfig.HEADER_FAILURE_REASON);
                    copyHeader(originalProperties, properties, RabbitMQConfig.HEADER_FAILURE_AT);
                    properties.setHeader(HEADER_EMAIL_ATTEMPT, nextAttempt);
                    properties.setExpiration(Long.toString(delayMs));
                    properties.setDeliveryMode(MessageDeliveryMode.PERSISTENT);
                    return outgoing;
                },
                correlationData);

        CorrelationData.Confirm confirm;
        try {
            confirm = correlationData.getFuture().get(Math.max(1, publisherConfirmTimeoutMs), TimeUnit.MILLISECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Interrupted while waiting for retry publish confirmation", e);
        } catch (TimeoutException e) {
            throw new IllegalStateException("Timed out waiting for retry publish confirmation", e);
        } catch (ExecutionException e) {
            throw new IllegalStateException("Retry publish confirmation failed", e.getCause());
        }
        if (!confirm.isAck()) {
            throw new IllegalStateException("RabbitMQ negatively confirmed retry publish: " + confirm.getReason());
        }
        ReturnedMessage returned = correlationData.getReturned();
        if (returned != null) {
            throw new IllegalStateException("RabbitMQ returned unroutable retry message: " + returned.getReplyText());
        }
    }

    private String resolveDeliveryIdentity(
            Message message,
            RecommendationEmailMessage payload,
            Object retryAttemptHeader) {
        var properties = message.getMessageProperties();
        Object eventId = properties.getHeaders().get(RabbitMQConfig.HEADER_OUTBOX_EVENT_ID);
        if (eventId == null && properties.getMessageId() != null) {
            eventId = properties.getMessageId();
        }
        if (eventId == null) {
            if (payload == null || payload.getSubscriberId() == null || payload.getRecommendationIds() == null) {
                eventId = "legacy-" + sha256(new String(message.getBody(), StandardCharsets.UTF_8));
            } else {
                String canonicalIds = payload.getRecommendationIds().stream()
                        .sorted(Comparator.nullsFirst(Comparator.naturalOrder()))
                        .map(String::valueOf)
                        .collect(Collectors.joining(","));
                eventId = "legacy-" + sha256(payload.getSubscriberId() + ":" + canonicalIds);
            }
        }
        String stableEventId = eventId.toString();
        if (stableEventId.length() > 235) {
            stableEventId = "sha256-" + sha256(stableEventId);
        }
        properties.setHeader(RabbitMQConfig.HEADER_OUTBOX_EVENT_ID, stableEventId);
        if (properties.getMessageId() == null) {
            properties.setMessageId(stableEventId);
        }
        if (properties.getHeaders().get(RabbitMQConfig.HEADER_ORIGINAL_ROUTING_KEY) == null) {
            properties.setHeader(RabbitMQConfig.HEADER_ORIGINAL_ROUTING_KEY,
                    RabbitMQConfig.ROUTING_KEY_RECOMMENDATION_EMAIL);
        }
        if (properties.getHeaders().get(HEADER_EMAIL_ATTEMPT) == null) {
            properties.setHeader(HEADER_EMAIL_ATTEMPT, parseAttempt(retryAttemptHeader));
        }
        return "outbox:" + stableEventId;
    }

    private String sha256(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(digest.length * 2);
            for (byte part : digest) {
                hex.append(String.format("%02x", part));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException impossible) {
            throw new IllegalStateException("SHA-256 is unavailable", impossible);
        }
    }

    private void rejectInvalidMessage(Message amqpMessage, String reason) {
        markFailure(amqpMessage, "invalid-message", new IllegalArgumentException(reason));
        throw new AmqpRejectAndDontRequeueException("Invalid recommendation email message: " + reason);
    }

    private void markFailure(Message message, String category, Throwable failure) {
        var properties = message.getMessageProperties();
        properties.setHeader(RabbitMQConfig.HEADER_FAILURE_CATEGORY, category);
        properties.setHeader(RabbitMQConfig.HEADER_FAILURE_REASON, safeFailureReason(failure));
        properties.setHeader(RabbitMQConfig.HEADER_FAILURE_AT, Instant.now().toString());
    }

    private String failureCategory(Throwable failure, int attempt) {
        if (isTransientException(failure) && attempt >= Math.max(1, maxRetries)) {
            return "attempts-exhausted";
        }
        return isTransientException(failure) ? "retryable-email-failure" : "permanent-email-failure";
    }

    private String safeFailureReason(Throwable failure) {
        String message = failure.getMessage();
        String description = failure.getClass().getSimpleName();
        if (message != null && !message.isBlank()) {
            String sanitized = EMAIL_ADDRESS.matcher(message).replaceAll("[redacted-email]")
                    .replaceAll("[\\r\\n\\t]", " ")
                    .trim();
            if (!sanitized.isBlank()) {
                description += ": " + sanitized;
            }
        }
        return description.length() > 512 ? description.substring(0, 512) : description;
    }

    private String header(Message message, String name) {
        if (message == null) {
            return null;
        }
        Object value = message.getMessageProperties().getHeaders().get(name);
        return value == null ? null : value.toString();
    }

    private void copyHeader(
            org.springframework.amqp.core.MessageProperties source,
            org.springframework.amqp.core.MessageProperties target,
            String name) {
        Object value = source.getHeaders().get(name);
        if (value != null) {
            target.setHeader(name, value);
        }
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
