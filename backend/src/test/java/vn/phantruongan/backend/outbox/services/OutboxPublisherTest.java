package vn.phantruongan.backend.outbox.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.core.MessagePostProcessor;
import org.springframework.amqp.core.ReturnedMessage;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import vn.phantruongan.backend.config.common.RabbitMQConfig;
import vn.phantruongan.backend.outbox.entities.OutboxEvent;
import vn.phantruongan.backend.outbox.enums.OutboxStatus;
import vn.phantruongan.backend.recommendation.dtos.RecommendationEmailMessage;

@ExtendWith(MockitoExtension.class)
class OutboxPublisherTest {

    @Mock
    private OutboxEventService outboxEventService;

    @Mock
    private RabbitTemplate rabbitTemplate;

    private OutboxPublisher publisher;

    @BeforeEach
    void setUp() {
        publisher = org.mockito.Mockito.spy(new OutboxPublisher(outboxEventService, rabbitTemplate, new ObjectMapper()));
        ReflectionTestUtils.setField(publisher, "batchSize", 10);
        ReflectionTestUtils.setField(publisher, "claimLeaseSeconds", 120L);
        ReflectionTestUtils.setField(publisher, "confirmTimeoutMs", 100L);
        ReflectionTestUtils.setField(publisher, "backoffBaseMs", 1000L);
        ReflectionTestUtils.setField(publisher, "backoffMaxMs", 30000L);
    }

    @Test
    void positiveConfirmationMarksPublishedAndSendsExistingMessageContract() throws Exception {
        OutboxEvent event = event(17L, 5L, 0);
        when(outboxEventService.claimDueEvents(eq(10), any())).thenReturn(List.of(event));
        confirmPublishes(true);

        publisher.publishPendingEvents();

        ArgumentCaptor<RecommendationEmailMessage> messageCaptor =
                ArgumentCaptor.forClass(RecommendationEmailMessage.class);
        ArgumentCaptor<MessagePostProcessor> postProcessorCaptor =
                ArgumentCaptor.forClass(MessagePostProcessor.class);
        verify(rabbitTemplate).convertAndSend(
                eq(RabbitMQConfig.EXCHANGE_RECOMMENDATION_EMAIL),
                eq(RabbitMQConfig.ROUTING_KEY_RECOMMENDATION_EMAIL),
                messageCaptor.capture(),
                postProcessorCaptor.capture(),
                any(CorrelationData.class));
        assertEquals(5L, messageCaptor.getValue().getSubscriberId());
        assertEquals("candidate@example.test", messageCaptor.getValue().getSubscriberEmail());
        assertEquals("Candidate", messageCaptor.getValue().getSubscriberName());
        assertEquals(List.of(91L, 92L), messageCaptor.getValue().getRecommendationIds());
        Message outbound = postProcessorCaptor.getValue()
                .postProcessMessage(new Message(new byte[0], new MessageProperties()));
        assertEquals("recommendation-email-outbox-17", outbound.getMessageProperties().getMessageId());
        assertEquals("17", outbound.getMessageProperties().getHeaders()
                .get(RabbitMQConfig.HEADER_OUTBOX_EVENT_ID));
        assertEquals(1, outbound.getMessageProperties().getHeaders()
                .get(RabbitMQConfig.HEADER_EMAIL_ATTEMPT));
        assertEquals(RabbitMQConfig.ROUTING_KEY_RECOMMENDATION_EMAIL,
                outbound.getMessageProperties().getHeaders().get(RabbitMQConfig.HEADER_ORIGINAL_ROUTING_KEY));
        verify(outboxEventService).markPublished(17L, event.getClaimToken());
        verify(outboxEventService, never()).scheduleRetry(anyLong(), any(), any(), anyString());
    }

    @Test
    void brokerUnavailableSchedulesRetryAndPublisherContinuesWithRemainingEvents() {
        OutboxEvent unavailable = event(17L, 5L, 0);
        OutboxEvent available = event(18L, 6L, 2);
        when(outboxEventService.claimDueEvents(eq(10), any())).thenReturn(List.of(unavailable, available));
        doAnswer(invocation -> {
            RecommendationEmailMessage message = invocation.getArgument(2);
            if (message.getSubscriberId() == 5L) {
                throw new IllegalStateException("broker unavailable");
            }
            CorrelationData correlationData = invocation.getArgument(4);
            correlationData.getFuture().complete(new CorrelationData.Confirm(true, null));
            return null;
        }).when(rabbitTemplate).convertAndSend(
                anyString(), anyString(), any(RecommendationEmailMessage.class), any(MessagePostProcessor.class),
                any(CorrelationData.class));

        Instant before = Instant.now();
        publisher.publishPendingEvents();
        Instant after = Instant.now();

        ArgumentCaptor<Instant> nextAttemptCaptor = ArgumentCaptor.forClass(Instant.class);
        verify(outboxEventService).scheduleRetry(
                eq(17L), eq(unavailable.getClaimToken()), nextAttemptCaptor.capture(), eq("broker unavailable"));
        assertEquals(false, nextAttemptCaptor.getValue().isBefore(before.plusMillis(1000)));
        assertEquals(false, nextAttemptCaptor.getValue().isAfter(after.plusMillis(1000)));
        verify(outboxEventService).markPublished(18L, available.getClaimToken());
    }

    @Test
    void negativeConfirmationLeavesEventRetryable() {
        OutboxEvent event = event(17L, 5L, 0);
        when(outboxEventService.claimDueEvents(eq(10), any())).thenReturn(List.of(event));
        confirmPublishes(false);

        publisher.publishPendingEvents();

        verify(outboxEventService, never()).markPublished(anyLong(), any());
        verify(outboxEventService).scheduleRetry(
                eq(17L), eq(event.getClaimToken()), any(Instant.class),
                eq("RabbitMQ negatively confirmed publish: negative confirmation"));
    }

    @Test
    void returnedMessageIsNotMarkedPublishedEvenWhenBrokerConfirms() {
        OutboxEvent event = event(17L, 5L, 0);
        when(outboxEventService.claimDueEvents(eq(10), any())).thenReturn(List.of(event));
        ReturnedMessage returned = org.mockito.Mockito.mock(ReturnedMessage.class);
        when(returned.getReplyText()).thenReturn("NO_ROUTE");
        CorrelationData correlationData = org.mockito.Mockito.mock(CorrelationData.class);
        CompletableFuture<CorrelationData.Confirm> confirmFuture = new CompletableFuture<>();
        when(correlationData.getFuture()).thenReturn(confirmFuture);
        when(correlationData.getReturned()).thenReturn(returned);
        doReturn(correlationData).when(publisher).createCorrelationData(event);
        doAnswer(invocation -> {
            CorrelationData sentCorrelationData = invocation.getArgument(4);
            sentCorrelationData.getFuture().complete(new CorrelationData.Confirm(true, null));
            return null;
        }).when(rabbitTemplate).convertAndSend(
                anyString(), anyString(), any(RecommendationEmailMessage.class), any(MessagePostProcessor.class),
                any(CorrelationData.class));

        publisher.publishPendingEvents();

        verify(outboxEventService, never()).markPublished(anyLong(), any());
        verify(outboxEventService).scheduleRetry(
                eq(17L), eq(event.getClaimToken()), any(Instant.class), eq("RabbitMQ returned unroutable message: NO_ROUTE"));
    }

    @Test
    void dueEventsAreClaimedInConfiguredBoundedBatch() {
        when(outboxEventService.claimDueEvents(eq(10), any())).thenReturn(List.of());

        publisher.publishPendingEvents();

        ArgumentCaptor<java.time.Duration> leaseCaptor = ArgumentCaptor.forClass(java.time.Duration.class);
        verify(outboxEventService).claimDueEvents(eq(10), leaseCaptor.capture());
        assertEquals(120, leaseCaptor.getValue().toSeconds());
        verify(rabbitTemplate, never()).convertAndSend(
                anyString(), anyString(), any(RecommendationEmailMessage.class), any(MessagePostProcessor.class),
                any(CorrelationData.class));
    }

    @Test
    void confirmationThenDatabaseFailureLeavesAtLeastOnceRecoveryWindow() {
        OutboxEvent event = event(17L, 5L, 0);
        when(outboxEventService.claimDueEvents(eq(10), any())).thenReturn(List.of(event));
        confirmPublishes(true);
        when(outboxEventService.markPublished(17L, event.getClaimToken()))
                .thenThrow(new IllegalStateException("database unavailable"));
        org.mockito.Mockito.doThrow(new IllegalStateException("database unavailable"))
                .when(outboxEventService)
                .scheduleRetry(anyLong(), any(), any(), anyString());

        publisher.publishPendingEvents();

        verify(outboxEventService).markPublished(17L, event.getClaimToken());
        verify(outboxEventService).scheduleRetry(eq(17L), eq(event.getClaimToken()), any(), anyString());
        // A confirmed message may be delivered again after lease expiry if the status update was not committed.
        assertEquals(OutboxStatus.PENDING, event.getStatus());
    }

    private void confirmPublishes(boolean ack) {
        doAnswer(invocation -> {
            CorrelationData correlationData = invocation.getArgument(4);
            correlationData.getFuture().complete(new CorrelationData.Confirm(ack,
                    ack ? null : "negative confirmation"));
            return null;
        }).when(rabbitTemplate).convertAndSend(
                anyString(), anyString(), any(RecommendationEmailMessage.class), any(MessagePostProcessor.class),
                any(CorrelationData.class));
    }

    private OutboxEvent event(long id, long subscriberId, int retryCount) {
        OutboxEvent event = new OutboxEvent();
        event.setId(id);
        event.setAggregateId(subscriberId);
        event.setEventType("RECOMMENDATION_EMAIL");
        event.setAggregateType("SUBSCRIBER");
        event.setStatus(OutboxStatus.PENDING);
        event.setRetryCount(retryCount);
        event.setClaimToken(UUID.randomUUID());
        event.setPayload("""
                {"subscriberId":%d,"subscriberEmail":"candidate@example.test","subscriberName":"Candidate","recommendationIds":[91,92]}
                """.formatted(subscriberId));
        return event;
    }
}
