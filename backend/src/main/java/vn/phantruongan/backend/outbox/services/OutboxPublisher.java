package vn.phantruongan.backend.outbox.services;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.core.ReturnedMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.phantruongan.backend.config.common.RabbitMQConfig;
import vn.phantruongan.backend.outbox.entities.OutboxEvent;
import vn.phantruongan.backend.recommendation.dtos.RecommendationEmailMessage;

@Component
@RequiredArgsConstructor
@Slf4j
public class OutboxPublisher {

    private static final int DEFAULT_BATCH_SIZE = 10;
    private static final Duration DEFAULT_CLAIM_LEASE = Duration.ofSeconds(120);

    private final OutboxEventService outboxEventService;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    @Value("${outbox.publisher.batch-size:10}")
    private int batchSize = DEFAULT_BATCH_SIZE;

    @Value("${outbox.publisher.claim-lease-seconds:120}")
    private long claimLeaseSeconds = DEFAULT_CLAIM_LEASE.toSeconds();

    @Value("${outbox.publisher.confirm-timeout-ms:10000}")
    private long confirmTimeoutMs = 10_000;

    @Value("${email.backoff-base-ms:1000}")
    private long backoffBaseMs;

    @Value("${email.backoff-max-ms:30000}")
    private long backoffMaxMs;

    @Scheduled(fixedDelayString = "${outbox.publisher.poll-interval-ms:5000}")
    public void publishPendingEvents() {
        List<OutboxEvent> claimedEvents;
        try {
            claimedEvents = outboxEventService.claimDueEvents(
                    Math.max(1, batchSize), Duration.ofSeconds(Math.max(1, claimLeaseSeconds)));
        } catch (Exception e) {
            log.error("Unable to claim due outbox events", e);
            return;
        }

        for (OutboxEvent event : claimedEvents) {
            publishOne(event);
        }
    }

    private void publishOne(OutboxEvent event) {
        try {
            RecommendationEmailMessage message = objectMapper.readValue(
                    event.getPayload(), RecommendationEmailMessage.class);
            CorrelationData correlationData = createCorrelationData(event);

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.EXCHANGE_RECOMMENDATION_EMAIL,
                    RabbitMQConfig.ROUTING_KEY_RECOMMENDATION_EMAIL,
                    message,
                    correlationData);

            CorrelationData.Confirm confirm = correlationData.getFuture()
                    .get(Math.max(1, confirmTimeoutMs), TimeUnit.MILLISECONDS);
            if (!confirm.isAck()) {
                throw new IllegalStateException("RabbitMQ negatively confirmed publish: " + confirm.getReason());
            }

            ReturnedMessage returned = correlationData.getReturned();
            if (returned != null) {
                throw new IllegalStateException("RabbitMQ returned unroutable message: " + returned.getReplyText());
            }

            // A crash after this broker confirmation and before the database update can cause a republish.
            // This is at-least-once delivery; consumer idempotency is handled in a later phase.
            if (!outboxEventService.markPublished(event.getId(), event.getClaimToken())) {
                log.warn("Outbox event {} was confirmed but its claim expired before it could be marked published",
                        event.getId());
                return;
            }
            log.debug("Published outbox event {}", event.getId());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            recordFailure(event, e);
        } catch (Exception e) {
            recordFailure(event, e);
        }
    }

    private void recordFailure(OutboxEvent event, Exception failure) {
        int nextRetryCount = event.getRetryCount() + 1;
        Instant nextAttemptAt = Instant.now().plusMillis(backoffDelayMs(nextRetryCount));
        String error = failure.getMessage();
        if (error == null || error.isBlank()) {
            error = failure.getClass().getSimpleName();
        }
        if (error.length() > 4000) {
            error = error.substring(0, 4000);
        }

        try {
            boolean updated = outboxEventService.scheduleRetry(
                    event.getId(), event.getClaimToken(), nextAttemptAt, error);
            if (updated) {
                log.warn("Outbox publish failed for event {}; retry {} scheduled at {}: {}",
                        event.getId(), nextRetryCount, nextAttemptAt, error);
            } else {
                log.warn("Outbox event {} is no longer owned by this publisher; retry state was not changed",
                        event.getId());
            }
        } catch (Exception updateFailure) {
            log.error("Unable to persist retry state for outbox event {}", event.getId(), updateFailure);
        }
    }

    private long backoffDelayMs(int retryCount) {
        long cap = Math.max(1, backoffMaxMs);
        long delay = Math.max(1, Math.min(backoffBaseMs, cap));
        for (int retry = 1; retry < retryCount && delay < cap; retry++) {
            delay = delay > cap / 2 ? cap : Math.min(delay * 2, cap);
        }
        return delay;
    }

    CorrelationData createCorrelationData(OutboxEvent event) {
        return new CorrelationData(event.getId() + ":" + event.getClaimToken());
    }
}
