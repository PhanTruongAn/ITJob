package vn.phantruongan.backend.config.common;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.test.util.ReflectionTestUtils;
import static org.mockito.Mockito.mock;

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
        assertFalse(RabbitMQConfig.EXCHANGE_RECOMMENDATION_EMAIL_DLQ.equals(
                retryQueue.getArguments().get("x-dead-letter-exchange")));
        // Retry delay is a per-message expiration, so the queue has no fixed x-message-ttl.
        assertTrue(retryQueue.getArguments().get("x-message-ttl") == null);
    }

    @Test
    void mainQueueStillDeadLettersRejectedMessagesToExistingDlq() {
        Queue mainQueue = configuration.recommendationEmailQueue();

        assertEquals(RabbitMQConfig.EXCHANGE_RECOMMENDATION_EMAIL_DLQ,
                mainQueue.getArguments().get("x-dead-letter-exchange"));
        Queue dlq = configuration.recommendationEmailDlqQueue();
        TopicExchange dlqExchange = configuration.recommendationEmailDlqExchange();
        Binding dlqBinding = configuration.bindingRecommendationEmailDlq(dlqExchange);
        assertEquals(RabbitMQConfig.QUEUE_RECOMMENDATION_EMAIL_DLQ, dlq.getName());
        assertTrue(dlq.isDurable());
        assertTrue(dlqExchange.isDurable());
        assertEquals("#", dlqBinding.getRoutingKey());
    }

    @Test
    void retryExpiryReturnsToMainAndMainRejectionTerminatesAtDlq() {
        Queue retryQueue = configuration.recommendationEmailRetryQueue();
        Queue mainQueue = configuration.recommendationEmailQueue();

        assertEquals(RabbitMQConfig.EXCHANGE_RECOMMENDATION_EMAIL,
                retryQueue.getArguments().get("x-dead-letter-exchange"));
        assertEquals(RabbitMQConfig.EXCHANGE_RECOMMENDATION_EMAIL_DLQ,
                mainQueue.getArguments().get("x-dead-letter-exchange"));
        assertFalse(retryQueue.getArguments().get("x-dead-letter-exchange")
                .equals(mainQueue.getName()));
    }

    @Test
    void listenerFactoryRejectsWithoutRequeueToPreventPoisonMessageLoop() {
        SimpleRabbitListenerContainerFactory factory = configuration.rabbitListenerContainerFactory(
                mock(ConnectionFactory.class), mock(MessageConverter.class));

        assertEquals(Boolean.FALSE, ReflectionTestUtils.getField(factory, "defaultRequeueRejected"));
    }
}
