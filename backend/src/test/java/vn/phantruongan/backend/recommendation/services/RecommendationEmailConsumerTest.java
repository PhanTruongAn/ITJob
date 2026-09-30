package vn.phantruongan.backend.recommendation.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import vn.phantruongan.backend.common.email.EmailService;
import vn.phantruongan.backend.config.common.RabbitMQConfig;
import vn.phantruongan.backend.recommendation.dtos.RecommendationEmailMessage;
import vn.phantruongan.backend.recommendation.dtos.res.JobRecommendationResDTO;
import vn.phantruongan.backend.recommendation.entities.EmailSendHistory;
import vn.phantruongan.backend.recommendation.entities.JobRecommendation;
import vn.phantruongan.backend.recommendation.enums.EmailStatus;
import vn.phantruongan.backend.recommendation.repositories.EmailSendHistoryRepository;
import vn.phantruongan.backend.recommendation.repositories.JobRecommendationRepository;

@ExtendWith(MockitoExtension.class)
class RecommendationEmailConsumerTest {

    @Mock
    private JobRecommendationRepository jobRecommendationRepository;
    @Mock
    private EmailService emailService;
    @Mock
    private JobRecommendationService jobRecommendationService;
    @Mock
    private EmailSendHistoryRepository emailSendHistoryRepository;
    @Mock
    private RabbitTemplate rabbitTemplate;

    private RecommendationEmailConsumer consumer;

    @BeforeEach
    void setUp() {
        consumer = new RecommendationEmailConsumer(
                jobRecommendationRepository,
                emailService,
                jobRecommendationService,
                emailSendHistoryRepository,
                new SimpleMeterRegistry(),
                rabbitTemplate);
        ReflectionTestUtils.setField(consumer, "backoffBaseMs", 1000);
        ReflectionTestUtils.setField(consumer, "backoffMaxMs", 30000);
        ReflectionTestUtils.setField(consumer, "maxRetries", 3);
    }

    @Test
    void successfulBatchSendsOneEmailAndMarksAllRecommendationsSent() throws Exception {
        RecommendationEmailMessage message = message(11L, 12L);
        List<JobRecommendation> recommendations = List.of(recommendation(11L, 0), recommendation(12L, 0));
        when(jobRecommendationRepository.findAllByIdIn(message.getRecommendationIds())).thenReturn(recommendations);
        when(jobRecommendationService.convertToResDTO(any(JobRecommendation.class)))
                .thenReturn(new JobRecommendationResDTO());

        consumer.consumeRecommendationEmail(message, null);

        ArgumentCaptor<List<JobRecommendationResDTO>> recommendationsCaptor = ArgumentCaptor.forClass(List.class);
        verify(emailService).sendJobRecommendationsEmail(
                eq("candidate@example.test"), eq(null), recommendationsCaptor.capture());
        assertEquals(2, recommendationsCaptor.getValue().size());
        verify(jobRecommendationRepository).updateEmailStatusAndSentAtByIds(
                eq(message.getRecommendationIds()), eq(EmailStatus.SENT), any());
        verify(emailSendHistoryRepository, org.mockito.Mockito.times(2)).save(any(EmailSendHistory.class));
        verify(rabbitTemplate, never()).convertAndSend(
                any(String.class), any(String.class), any(RecommendationEmailMessage.class), any(MessagePostProcessor.class));
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

        assertTimeout(Duration.ofSeconds(1), () -> consumer.consumeRecommendationEmail(message, null));

        ArgumentCaptor<MessagePostProcessor> processorCaptor = ArgumentCaptor.forClass(MessagePostProcessor.class);
        verify(rabbitTemplate).convertAndSend(
                eq(""), eq(RabbitMQConfig.QUEUE_RECOMMENDATION_EMAIL_RETRY), eq(message), processorCaptor.capture());
        Message retry = processorCaptor.getValue().postProcessMessage(new Message(new byte[0], new MessageProperties()));
        assertEquals(1000L, Long.parseLong(retry.getMessageProperties().getExpiration()));
        assertEquals(2, retry.getMessageProperties().getHeaders()
                .get(RecommendationEmailConsumer.HEADER_EMAIL_ATTEMPT));
        assertEquals(MessageDeliveryMode.PERSISTENT, retry.getMessageProperties().getDeliveryMode());
        verify(jobRecommendationRepository).updateEmailStatusAndRetryCountByIds(
                eq(message.getRecommendationIds()), eq(EmailStatus.PENDING), eq(1));
        verify(emailSendHistoryRepository, org.mockito.Mockito.times(2)).save(any(EmailSendHistory.class));
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

        consumer.consumeRecommendationEmail(message, 2);

        verify(jobRecommendationRepository).updateEmailStatusAndRetryCountByIds(
                eq(message.getRecommendationIds()), eq(EmailStatus.PENDING), eq(2));
        ArgumentCaptor<MessagePostProcessor> processorCaptor = ArgumentCaptor.forClass(MessagePostProcessor.class);
        verify(rabbitTemplate).convertAndSend(
                eq(""), eq(RabbitMQConfig.QUEUE_RECOMMENDATION_EMAIL_RETRY), eq(message), processorCaptor.capture());
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

        assertThrows(AmqpRejectAndDontRequeueException.class,
                () -> consumer.consumeRecommendationEmail(message, null));

        verify(jobRecommendationRepository).updateEmailStatusAndRetryCountByIds(
                eq(message.getRecommendationIds()), eq(EmailStatus.FAILED), eq(3));
        verify(rabbitTemplate, never()).convertAndSend(
                any(String.class), any(String.class), any(RecommendationEmailMessage.class), any(MessagePostProcessor.class));
        verify(emailSendHistoryRepository).save(any(EmailSendHistory.class));
    }

    @Test
    void permanentFailureMarksFailedAndRejectsToDlqWithoutRetry() throws Exception {
        RecommendationEmailMessage message = message(51L);
        when(jobRecommendationRepository.findAllByIdIn(message.getRecommendationIds()))
                .thenReturn(List.of(recommendation(51L, 0)));
        when(jobRecommendationService.convertToResDTO(any(JobRecommendation.class)))
                .thenReturn(new JobRecommendationResDTO());
        org.mockito.Mockito.doThrow(new IllegalArgumentException("invalid email address"))
                .when(emailService).sendJobRecommendationsEmail(eq("candidate@example.test"), eq(null), any());

        assertThrows(AmqpRejectAndDontRequeueException.class,
                () -> consumer.consumeRecommendationEmail(message, null));

        verify(jobRecommendationRepository).updateEmailStatusByIds(message.getRecommendationIds(), EmailStatus.FAILED);
        verify(rabbitTemplate, never()).convertAndSend(
                any(String.class), any(String.class), any(RecommendationEmailMessage.class), any(MessagePostProcessor.class));
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
                        any(String.class), any(String.class), any(RecommendationEmailMessage.class), any(MessagePostProcessor.class));

        AmqpRejectAndDontRequeueException exception = assertThrows(
                AmqpRejectAndDontRequeueException.class,
                () -> consumer.consumeRecommendationEmail(message, null));

        assertTrue(exception.getMessage().contains("Could not enqueue"));
    }

    private RecommendationEmailMessage message(Long... ids) {
        return RecommendationEmailMessage.builder()
                .subscriberId(7L)
                .subscriberEmail("candidate@example.test")
                .subscriberName("Candidate")
                .recommendationIds(List.of(ids))
                .build();
    }

    private JobRecommendation recommendation(Long id, int retryCount) {
        JobRecommendation recommendation = new JobRecommendation();
        recommendation.setId(id);
        recommendation.setRetryCount(retryCount);
        return recommendation;
    }
}
