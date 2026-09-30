package vn.phantruongan.backend.recommendation.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTimeout;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.net.ConnectException;
import java.time.Duration;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.AmqpRejectAndDontRequeueException;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageDeliveryMode;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.core.MessagePostProcessor;
import org.springframework.amqp.core.ReturnedMessage;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import vn.phantruongan.backend.common.email.EmailService;
import vn.phantruongan.backend.config.common.RabbitMQConfig;
import vn.phantruongan.backend.recommendation.dtos.RecommendationEmailMessage;
import vn.phantruongan.backend.recommendation.dtos.res.JobRecommendationResDTO;
import vn.phantruongan.backend.recommendation.entities.JobRecommendation;
import vn.phantruongan.backend.recommendation.enums.EmailDeliveryClaimResult;
import vn.phantruongan.backend.recommendation.repositories.JobRecommendationRepository;
import vn.phantruongan.backend.subscriber.entities.Subscriber;

@ExtendWith(MockitoExtension.class)
class RecommendationEmailConsumerTest {

    @Mock
    private JobRecommendationRepository jobRecommendationRepository;
    @Mock
    private EmailService emailService;
    @Mock
    private JobRecommendationService jobRecommendationService;
    @Mock
    private RecommendationEmailDeliveryService deliveryService;
    @Mock
    private RabbitTemplate rabbitTemplate;

    private RecommendationEmailConsumer consumer;

    @BeforeEach
    void setUp() {
        consumer = new RecommendationEmailConsumer(
                jobRecommendationRepository,
                emailService,
                jobRecommendationService,
                deliveryService,
                new SimpleMeterRegistry(),
                rabbitTemplate);
        org.mockito.Mockito.lenient().when(deliveryService.claim(any(String.class), org.mockito.ArgumentMatchers.anyInt()))
                .thenReturn(EmailDeliveryClaimResult.CLAIMED);
        ReflectionTestUtils.setField(consumer, "backoffBaseMs", 1000);
        ReflectionTestUtils.setField(consumer, "backoffMaxMs", 30000);
        ReflectionTestUtils.setField(consumer, "maxRetries", 3);
        ReflectionTestUtils.setField(consumer, "publisherConfirmTimeoutMs", 10000L);
        org.mockito.Mockito.lenient().doAnswer(invocation -> {
            CorrelationData correlationData = invocation.getArgument(4);
            correlationData.getFuture().complete(new CorrelationData.Confirm(true, null));
            return null;
        }).when(rabbitTemplate).convertAndSend(any(String.class), any(String.class),
                any(RecommendationEmailMessage.class), any(MessagePostProcessor.class), any(CorrelationData.class));
    }

    @Test
    void successfulBatchSendsOneEmailAndMarksAllRecommendationsSent() throws Exception {
        RecommendationEmailMessage message = message(11L, 12L);
        List<JobRecommendation> recommendations = List.of(recommendation(11L, 0), recommendation(12L, 0));
        when(jobRecommendationRepository.findAllByIdIn(message.getRecommendationIds())).thenReturn(recommendations);
        when(jobRecommendationService.convertToResDTO(any(JobRecommendation.class)))
                .thenReturn(new JobRecommendationResDTO());

        consumer.consumeRecommendationEmail(message, null, brokerMessage("outbox-11", null));

        ArgumentCaptor<List<JobRecommendationResDTO>> recommendationsCaptor = ArgumentCaptor.forClass(List.class);
        verify(emailService).sendJobRecommendationsEmail(
                eq("candidate@example.test"), eq(null), recommendationsCaptor.capture());
        assertEquals(2, recommendationsCaptor.getValue().size());
        verify(deliveryService).claim("outbox:outbox-11", 1);
        verify(deliveryService).markSent(eq("outbox:outbox-11"), eq(message.getRecommendationIds()),
                eq("candidate@example.test"), eq(1));
        verify(rabbitTemplate, never()).convertAndSend(
                any(String.class), any(String.class), any(RecommendationEmailMessage.class),
                any(MessagePostProcessor.class), any(CorrelationData.class));
    }

    @Test
    void transientFailurePublishesPersistentRetryWithTtlAndReturnsWithoutSleeping() throws Exception {
        RecommendationEmailMessage message = message(21L, 22L);
        when(jobRecommendationRepository.findAllByIdIn(message.getRecommendationIds()))
                .thenReturn(List.of(recommendation(21L, 0), recommendation(22L, 0)));
        when(jobRecommendationService.convertToResDTO(any(JobRecommendation.class)))
                .thenReturn(new JobRecommendationResDTO());
        org.mockito.Mockito.doThrow(new IllegalStateException(new ConnectException("SMTP connect failed")))
                .when(emailService).sendJobRecommendationsEmail(
                        eq("candidate@example.test"), eq(null), any());

        Message inbound = brokerMessage("21", null);
        assertTimeout(Duration.ofSeconds(1), () -> consumer.consumeRecommendationEmail(message, null, inbound));

        ArgumentCaptor<MessagePostProcessor> processorCaptor = ArgumentCaptor.forClass(MessagePostProcessor.class);
        ArgumentCaptor<CorrelationData> correlationCaptor = ArgumentCaptor.forClass(CorrelationData.class);
        verify(rabbitTemplate).convertAndSend(
                eq(""), eq(RabbitMQConfig.QUEUE_RECOMMENDATION_EMAIL_RETRY), eq(message),
                processorCaptor.capture(), correlationCaptor.capture());
        Message retry = processorCaptor.getValue().postProcessMessage(new Message(new byte[0], new MessageProperties()));
        assertEquals(1000L, Long.parseLong(retry.getMessageProperties().getExpiration()));
        assertEquals(2, retry.getMessageProperties().getHeaders()
                .get(RecommendationEmailConsumer.HEADER_EMAIL_ATTEMPT));
        assertEquals(MessageDeliveryMode.PERSISTENT, retry.getMessageProperties().getDeliveryMode());
        assertEquals("21", retry.getMessageProperties().getHeaders().get(RabbitMQConfig.HEADER_OUTBOX_EVENT_ID));
        assertEquals("recommendation-email-outbox-21", retry.getMessageProperties().getMessageId());
        assertEquals("retryable-email-failure", retry.getMessageProperties().getHeaders()
                .get(RabbitMQConfig.HEADER_FAILURE_CATEGORY));
        assertNotNull(retry.getMessageProperties().getHeaders().get(RabbitMQConfig.HEADER_FAILURE_REASON));
        assertNotNull(retry.getMessageProperties().getHeaders().get(RabbitMQConfig.HEADER_FAILURE_AT));
        assertTrue(correlationCaptor.getValue().getFuture().isDone());
        assertTrue(correlationCaptor.getValue().getFuture().get().isAck());
        verify(deliveryService).markRetryPending(eq("outbox:21"), eq(message.getRecommendationIds()),
                eq("candidate@example.test"), eq(1), eq("retryable-email-failure"), any(String.class));
    }

    @Test
    void attemptHeaderAndDatabaseRetryCountKeepTotalAttemptLimit() throws Exception {
        RecommendationEmailMessage message = message(31L);
        when(jobRecommendationRepository.findAllByIdIn(message.getRecommendationIds()))
                .thenReturn(List.of(recommendation(31L, 1)));
        when(jobRecommendationService.convertToResDTO(any(JobRecommendation.class)))
                .thenReturn(new JobRecommendationResDTO());
        org.mockito.Mockito.doThrow(new IllegalStateException(new ConnectException("SMTP connection reset")))
                .when(emailService).sendJobRecommendationsEmail(eq("candidate@example.test"), eq(null), any());

        consumer.consumeRecommendationEmail(message, 2, brokerMessage("31", 2));

        verify(deliveryService).markRetryPending(any(String.class), eq(message.getRecommendationIds()),
                eq("candidate@example.test"), eq(2), eq("retryable-email-failure"), any(String.class));
        ArgumentCaptor<MessagePostProcessor> processorCaptor = ArgumentCaptor.forClass(MessagePostProcessor.class);
        verify(rabbitTemplate).convertAndSend(
                eq(""), eq(RabbitMQConfig.QUEUE_RECOMMENDATION_EMAIL_RETRY), eq(message),
                processorCaptor.capture(), any(CorrelationData.class));
        Message retry = processorCaptor.getValue().postProcessMessage(new Message(new byte[0], new MessageProperties()));
        assertEquals(3, retry.getMessageProperties().getHeaders()
                .get(RecommendationEmailConsumer.HEADER_EMAIL_ATTEMPT));
        assertEquals(2000L, Long.parseLong(retry.getMessageProperties().getExpiration()));
    }

    @Test
    void exhaustedTransientFailureMarksFailedAndRejectsToDlq() throws Exception {
        RecommendationEmailMessage message = message(41L);
        when(jobRecommendationRepository.findAllByIdIn(message.getRecommendationIds()))
                .thenReturn(List.of(recommendation(41L, 2)));
        when(jobRecommendationService.convertToResDTO(any(JobRecommendation.class)))
                .thenReturn(new JobRecommendationResDTO());
        org.mockito.Mockito.doThrow(new IllegalStateException(new ConnectException("SMTP connection refused")))
                .when(emailService).sendJobRecommendationsEmail(eq("candidate@example.test"), eq(null), any());

        Message inbound = brokerMessage("41", null);
        assertThrows(AmqpRejectAndDontRequeueException.class,
                () -> consumer.consumeRecommendationEmail(message, null, inbound));

        verify(deliveryService).markFailed(any(String.class), eq(message.getRecommendationIds()),
                eq("candidate@example.test"), eq(3), eq(true), eq("attempts-exhausted"), any(String.class));
        verify(rabbitTemplate, never()).convertAndSend(
                any(String.class), any(String.class), any(RecommendationEmailMessage.class),
                any(MessagePostProcessor.class), any(CorrelationData.class));
        assertEquals("attempts-exhausted", inbound.getMessageProperties().getHeaders()
                .get(RabbitMQConfig.HEADER_FAILURE_CATEGORY));
        assertNotNull(inbound.getMessageProperties().getHeaders().get(RabbitMQConfig.HEADER_FAILURE_AT));
    }

    @Test
    void permanentFailureMarksFailedAndRejectsToDlqWithoutRetry() throws Exception {
        RecommendationEmailMessage message = message(51L);
        when(jobRecommendationRepository.findAllByIdIn(message.getRecommendationIds()))
                .thenReturn(List.of(recommendation(51L, 0)));
        when(jobRecommendationService.convertToResDTO(any(JobRecommendation.class)))
                .thenReturn(new JobRecommendationResDTO());
        org.mockito.Mockito.doThrow(new IllegalArgumentException(
                "invalid recipient candidate@example.test"))
                .when(emailService).sendJobRecommendationsEmail(eq("candidate@example.test"), eq(null), any());

        Message inbound = brokerMessage("51", null);
        assertThrows(AmqpRejectAndDontRequeueException.class,
                () -> consumer.consumeRecommendationEmail(message, null, inbound));

        verify(deliveryService).markFailed(any(String.class), eq(message.getRecommendationIds()),
                eq("candidate@example.test"), eq(1), eq(false), eq("permanent-email-failure"), any(String.class));
        verify(rabbitTemplate, never()).convertAndSend(
                any(String.class), any(String.class), any(RecommendationEmailMessage.class),
                any(MessagePostProcessor.class), any(CorrelationData.class));
        assertEquals("permanent-email-failure", inbound.getMessageProperties().getHeaders()
                .get(RabbitMQConfig.HEADER_FAILURE_CATEGORY));
        assertFalse(inbound.getMessageProperties().getHeaders()
                .get(RabbitMQConfig.HEADER_FAILURE_REASON).toString().contains("candidate@example.test"));
    }

    @Test
    void failedRetryPublishRejectsOriginalSoItReachesExistingDlq() throws Exception {
        RecommendationEmailMessage message = message(61L);
        when(jobRecommendationRepository.findAllByIdIn(message.getRecommendationIds()))
                .thenReturn(List.of(recommendation(61L, 0)));
        when(jobRecommendationService.convertToResDTO(any(JobRecommendation.class)))
                .thenReturn(new JobRecommendationResDTO());
        org.mockito.Mockito.doThrow(new IllegalStateException(new ConnectException("SMTP connect failed")))
                .when(emailService).sendJobRecommendationsEmail(eq("candidate@example.test"), eq(null), any());
        org.mockito.Mockito.doThrow(new IllegalStateException("retry queue unavailable"))
                .when(rabbitTemplate).convertAndSend(
                        any(String.class), any(String.class), any(RecommendationEmailMessage.class),
                        any(MessagePostProcessor.class), any(CorrelationData.class));

        Message inbound = brokerMessage("61", null);
        AmqpRejectAndDontRequeueException exception = assertThrows(
                AmqpRejectAndDontRequeueException.class,
                () -> consumer.consumeRecommendationEmail(message, null, inbound));

        assertTrue(exception.getMessage().contains("Could not enqueue"));
        assertEquals("retry-publication-failure", inbound.getMessageProperties().getHeaders()
                .get(RabbitMQConfig.HEADER_FAILURE_CATEGORY));
        verify(deliveryService).markRetryPublicationFailed(eq("outbox:61"),
                eq("retry-publication-failure"), any(String.class));
    }

    @Test
    void negativeRetryPublisherConfirmRejectsOriginalToDlq() throws Exception {
        RecommendationEmailMessage message = message(62L);
        when(jobRecommendationRepository.findAllByIdIn(message.getRecommendationIds()))
                .thenReturn(List.of(recommendation(62L, 0)));
        when(jobRecommendationService.convertToResDTO(any(JobRecommendation.class)))
                .thenReturn(new JobRecommendationResDTO());
        org.mockito.Mockito.doThrow(new IllegalStateException(new ConnectException("SMTP connect failed")))
                .when(emailService).sendJobRecommendationsEmail(eq("candidate@example.test"), eq(null), any());
        org.mockito.Mockito.doAnswer(invocation -> {
            CorrelationData correlationData = invocation.getArgument(4);
            correlationData.getFuture().complete(new CorrelationData.Confirm(false, "broker nack"));
            return null;
        }).when(rabbitTemplate).convertAndSend(any(String.class), any(String.class),
                any(RecommendationEmailMessage.class), any(MessagePostProcessor.class), any(CorrelationData.class));

        Message inbound = brokerMessage("62", null);
        assertThrows(AmqpRejectAndDontRequeueException.class,
                () -> consumer.consumeRecommendationEmail(message, null, inbound));

        assertEquals("retry-publication-failure", inbound.getMessageProperties().getHeaders()
                .get(RabbitMQConfig.HEADER_FAILURE_CATEGORY));
        verify(deliveryService).markRetryPublicationFailed(eq("outbox:62"),
                eq("retry-publication-failure"), any(String.class));
    }

    @Test
    void returnedRetryMessageRejectsOriginalToDlq() throws Exception {
        RecommendationEmailMessage message = message(63L);
        when(jobRecommendationRepository.findAllByIdIn(message.getRecommendationIds()))
                .thenReturn(List.of(recommendation(63L, 0)));
        when(jobRecommendationService.convertToResDTO(any(JobRecommendation.class)))
                .thenReturn(new JobRecommendationResDTO());
        org.mockito.Mockito.doThrow(new IllegalStateException(new ConnectException("SMTP connect failed")))
                .when(emailService).sendJobRecommendationsEmail(eq("candidate@example.test"), eq(null), any());
        org.mockito.Mockito.doAnswer(invocation -> {
            CorrelationData correlationData = invocation.getArgument(4);
            correlationData.setReturned(new ReturnedMessage(new Message(new byte[0], new MessageProperties()),
                    312, "NO_ROUTE", "", RabbitMQConfig.QUEUE_RECOMMENDATION_EMAIL_RETRY));
            correlationData.getFuture().complete(new CorrelationData.Confirm(true, null));
            return null;
        }).when(rabbitTemplate).convertAndSend(any(String.class), any(String.class),
                any(RecommendationEmailMessage.class), any(MessagePostProcessor.class), any(CorrelationData.class));

        Message inbound = brokerMessage("63", null);
        assertThrows(AmqpRejectAndDontRequeueException.class,
                () -> consumer.consumeRecommendationEmail(message, null, inbound));

        assertEquals("retry-publication-failure", inbound.getMessageProperties().getHeaders()
                .get(RabbitMQConfig.HEADER_FAILURE_CATEGORY));
        verify(deliveryService).markRetryPublicationFailed(eq("outbox:63"),
                eq("retry-publication-failure"), any(String.class));
    }

    @Test
    void retryPublisherConfirmTimeoutRejectsOriginalToDlq() throws Exception {
        RecommendationEmailMessage message = message(64L);
        when(jobRecommendationRepository.findAllByIdIn(message.getRecommendationIds()))
                .thenReturn(List.of(recommendation(64L, 0)));
        when(jobRecommendationService.convertToResDTO(any(JobRecommendation.class)))
                .thenReturn(new JobRecommendationResDTO());
        org.mockito.Mockito.doThrow(new IllegalStateException(new ConnectException("SMTP connect failed")))
                .when(emailService).sendJobRecommendationsEmail(eq("candidate@example.test"), eq(null), any());
        ReflectionTestUtils.setField(consumer, "publisherConfirmTimeoutMs", 1L);
        org.mockito.Mockito.doAnswer(invocation -> null)
                .when(rabbitTemplate).convertAndSend(any(String.class), any(String.class),
                        any(RecommendationEmailMessage.class), any(MessagePostProcessor.class), any(CorrelationData.class));

        Message inbound = brokerMessage("64", null);
        assertThrows(AmqpRejectAndDontRequeueException.class,
                () -> consumer.consumeRecommendationEmail(message, null, inbound));

        assertEquals("retry-publication-failure", inbound.getMessageProperties().getHeaders()
                .get(RabbitMQConfig.HEADER_FAILURE_CATEGORY));
        verify(deliveryService).markRetryPublicationFailed(eq("outbox:64"),
                eq("retry-publication-failure"), any(String.class));
    }

    @Test
    void invalidMessageIsRejectedToDlqWithOperationalMetadata() {
        RecommendationEmailMessage message = message();
        Message inbound = brokerMessage("outbox-invalid-1", null);

        assertThrows(AmqpRejectAndDontRequeueException.class,
                () -> consumer.consumeRecommendationEmail(message, null, inbound));

        assertEquals("invalid-message", inbound.getMessageProperties().getHeaders()
                .get(RabbitMQConfig.HEADER_FAILURE_CATEGORY));
        assertNotNull(inbound.getMessageProperties().getHeaders().get(RabbitMQConfig.HEADER_FAILURE_REASON));
        assertNotNull(inbound.getMessageProperties().getHeaders().get(RabbitMQConfig.HEADER_FAILURE_AT));
        verify(jobRecommendationRepository, never()).findAllByIdIn(any());
        verify(rabbitTemplate, never()).convertAndSend(
                any(String.class), any(String.class), any(RecommendationEmailMessage.class),
                any(MessagePostProcessor.class), any(CorrelationData.class));
    }

    @Test
    void duplicateAlreadyInProgressIsAcknowledgedWithoutAnotherSmtpSend() throws Exception {
        RecommendationEmailMessage message = message(71L);
        when(jobRecommendationRepository.findAllByIdIn(message.getRecommendationIds()))
                .thenReturn(List.of(recommendation(71L, 0)));
        when(deliveryService.claim("outbox:71", 1)).thenReturn(EmailDeliveryClaimResult.IN_PROGRESS);

        consumer.consumeRecommendationEmail(message, null, brokerMessage("71", null));

        verify(emailService, never()).sendJobRecommendationsEmail(any(), any(), any());
        verify(deliveryService, never()).markSent(any(), any(), any(), org.mockito.ArgumentMatchers.anyInt());
    }

    @Test
    void alreadySentDeliveryIsAcknowledgedWithoutAnotherSmtpSend() throws Exception {
        RecommendationEmailMessage message = message(72L);
        when(jobRecommendationRepository.findAllByIdIn(message.getRecommendationIds()))
                .thenReturn(List.of(recommendation(72L, 0)));
        when(deliveryService.claim("outbox:72", 1)).thenReturn(EmailDeliveryClaimResult.SENT);

        consumer.consumeRecommendationEmail(message, null, brokerMessage("72", null));

        verify(emailService, never()).sendJobRecommendationsEmail(any(), any(), any());
        verify(deliveryService, never()).markSent(any(), any(), any(), org.mockito.ArgumentMatchers.anyInt());
    }

    @Test
    void failedDeliveryRedeliveryIsRejectedWithoutRequeueForExistingDlq() throws Exception {
        RecommendationEmailMessage message = message(73L);
        when(jobRecommendationRepository.findAllByIdIn(message.getRecommendationIds()))
                .thenReturn(List.of(recommendation(73L, 3)));
        when(deliveryService.claim("outbox:73", 4)).thenReturn(EmailDeliveryClaimResult.FAILED);

        AmqpRejectAndDontRequeueException rejection = assertThrows(AmqpRejectAndDontRequeueException.class,
                () -> consumer.consumeRecommendationEmail(message, 3, brokerMessage("73", 3)));
        assertTrue(rejection.getMessage().contains("already failed"));

        verify(emailService, never()).sendJobRecommendationsEmail(any(), any(), any());
        verify(deliveryService, never()).markSent(any(), any(), any(), org.mockito.ArgumentMatchers.anyInt());
    }

    @Test
    void databaseFailureAfterSmtpLeavesTheDeliveryClaimedAndDoesNotQueueAnEmailRetry() throws Exception {
        RecommendationEmailMessage message = message(74L);
        when(jobRecommendationRepository.findAllByIdIn(message.getRecommendationIds()))
                .thenReturn(List.of(recommendation(74L, 0)));
        when(jobRecommendationService.convertToResDTO(any(JobRecommendation.class)))
                .thenReturn(new JobRecommendationResDTO());
        org.mockito.Mockito.doThrow(new IllegalStateException("database unavailable"))
                .when(deliveryService).markSent(any(String.class), any(), any(String.class), org.mockito.ArgumentMatchers.anyInt());

        assertThrows(IllegalStateException.class,
                () -> consumer.consumeRecommendationEmail(message, null, brokerMessage("74", null)));

        org.mockito.InOrder order = org.mockito.Mockito.inOrder(emailService, deliveryService);
        order.verify(emailService).sendJobRecommendationsEmail(eq("candidate@example.test"), eq(null), any());
        order.verify(deliveryService).markSent(eq("outbox:74"), eq(message.getRecommendationIds()),
                eq("candidate@example.test"), eq(1));
        verify(rabbitTemplate, never()).convertAndSend(
                any(String.class), any(String.class), any(RecommendationEmailMessage.class),
                any(MessagePostProcessor.class), any(CorrelationData.class));
    }

    @Test
    void legacyRedeliveryWithoutPublisherHeadersUsesTheSameDeterministicIdentity() throws Exception {
        RecommendationEmailMessage message = message(81L, 82L);
        when(jobRecommendationRepository.findAllByIdIn(message.getRecommendationIds()))
                .thenReturn(List.of(recommendation(81L, 0), recommendation(82L, 0)));
        when(jobRecommendationService.convertToResDTO(any(JobRecommendation.class)))
                .thenReturn(new JobRecommendationResDTO());
        when(deliveryService.claim(any(String.class), org.mockito.ArgumentMatchers.anyInt()))
                .thenReturn(EmailDeliveryClaimResult.CLAIMED, EmailDeliveryClaimResult.IN_PROGRESS);
        Message firstDelivery = new Message(new byte[0], new MessageProperties());
        Message redelivery = new Message(new byte[0], new MessageProperties());

        consumer.consumeRecommendationEmail(message, null, firstDelivery);
        consumer.consumeRecommendationEmail(message, null, redelivery);

        ArgumentCaptor<String> identityCaptor = ArgumentCaptor.forClass(String.class);
        verify(deliveryService, org.mockito.Mockito.times(2))
                .claim(identityCaptor.capture(), org.mockito.ArgumentMatchers.eq(1));
        assertEquals(identityCaptor.getAllValues().get(0), identityCaptor.getAllValues().get(1));
        verify(emailService, org.mockito.Mockito.times(1))
                .sendJobRecommendationsEmail(eq("candidate@example.test"), eq(null), any());
    }

    private RecommendationEmailMessage message(Long... ids) {
        return RecommendationEmailMessage.builder()
                .subscriberId(7L)
                .subscriberEmail("candidate@example.test")
                .subscriberName("Candidate")
                .recommendationIds(List.of(ids))
                .build();
    }

    private Message brokerMessage(String eventId, Integer attempt) {
        MessageProperties properties = new MessageProperties();
        properties.setMessageId("recommendation-email-outbox-" + eventId);
        properties.setHeader(RabbitMQConfig.HEADER_OUTBOX_EVENT_ID, eventId);
        properties.setHeader(RabbitMQConfig.HEADER_ORIGINAL_ROUTING_KEY,
                RabbitMQConfig.ROUTING_KEY_RECOMMENDATION_EMAIL);
        if (attempt != null) {
            properties.setHeader(RabbitMQConfig.HEADER_EMAIL_ATTEMPT, attempt);
        }
        return new Message(new byte[0], properties);
    }

    private JobRecommendation recommendation(Long id, int retryCount) {
        JobRecommendation recommendation = new JobRecommendation();
        recommendation.setId(id);
        recommendation.setRetryCount(retryCount);
        Subscriber subscriber = new Subscriber();
        subscriber.setId(7L);
        recommendation.setSubscriber(subscriber);
        return recommendation;
    }
}
