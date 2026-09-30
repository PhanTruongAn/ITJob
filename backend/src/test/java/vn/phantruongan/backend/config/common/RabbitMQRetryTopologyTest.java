package vn.phantruongan.backend.config.common;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.amqp.core.Queue;

class RabbitMQRetryTopologyTest {

    private final RabbitMQConfig configuration = new RabbitMQConfig();

    @Test
    void retryQueueIsDurableAndTtlDeadLettersBackToMainQueue() {
        Queue retryQueue = configuration.recommendationEmailRetryQueue();

        assertEquals(RabbitMQConfig.QUEUE_RECOMMENDATION_EMAIL_RETRY, retryQueue.getName());
        assertTrue(retryQueue.isDurable());
        assertEquals(RabbitMQConfig.EXCHANGE_RECOMMENDATION_EMAIL,
                retryQueue.getArguments().get("x-dead-letter-exchange"));
        assertEquals(RabbitMQConfig.ROUTING_KEY_RECOMMENDATION_EMAIL,
                retryQueue.getArguments().get("x-dead-letter-routing-key"));
        // Retry delay is a per-message expiration, so the queue has no fixed x-message-ttl.
        assertTrue(retryQueue.getArguments().get("x-message-ttl") == null);
    }

    @Test
    void mainQueueStillDeadLettersRejectedMessagesToExistingDlq() {
        Queue mainQueue = configuration.recommendationEmailQueue();

        assertEquals(RabbitMQConfig.EXCHANGE_RECOMMENDATION_EMAIL_DLQ,
                mainQueue.getArguments().get("x-dead-letter-exchange"));
        assertEquals(RabbitMQConfig.QUEUE_RECOMMENDATION_EMAIL_DLQ,
                configuration.recommendationEmailDlqQueue().getName());
    }
}
