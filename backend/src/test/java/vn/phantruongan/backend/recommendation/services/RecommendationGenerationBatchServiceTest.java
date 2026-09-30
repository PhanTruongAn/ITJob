package vn.phantruongan.backend.recommendation.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.StreamSupport;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.aop.support.AopUtils;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.support.AbstractPlatformTransactionManager;
import org.springframework.transaction.support.DefaultTransactionStatus;

import com.fasterxml.jackson.databind.ObjectMapper;

import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.cronjob.entities.CronJob;
import vn.phantruongan.backend.follow.repositories.CompanyFollowRepository;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.job.entities.JobSkill;
import vn.phantruongan.backend.outbox.entities.OutboxEvent;
import vn.phantruongan.backend.outbox.enums.OutboxStatus;
import vn.phantruongan.backend.outbox.repositories.OutboxEventRepository;
import vn.phantruongan.backend.outbox.services.OutboxEventService;
import vn.phantruongan.backend.recommendation.dtos.RecommendationEmailMessage;
import vn.phantruongan.backend.recommendation.entities.JobRecommendation;
import vn.phantruongan.backend.recommendation.enums.EmailStatus;
import vn.phantruongan.backend.recommendation.enums.RecommendationStatus;
import vn.phantruongan.backend.recommendation.repositories.JobRecommendationRepository;
import vn.phantruongan.backend.subscriber.entities.Skill;
import vn.phantruongan.backend.subscriber.entities.Subscriber;
import vn.phantruongan.backend.subscriber.entities.SubscriberSkill;

class RecommendationGenerationBatchServiceTest {

    private AnnotationConfigApplicationContext context;
    private RecommendationGenerationBatchService service;
    private JobRecommendationRepository recommendationRepository;
    private OutboxEventRepository outboxRepository;
    private CompanyFollowRepository companyFollowRepository;
    private RecordingTransactionManager transactionManager;

    @BeforeEach
    void setUp() {
        context = new AnnotationConfigApplicationContext(TestConfiguration.class);
        service = context.getBean(RecommendationGenerationBatchService.class);
        recommendationRepository = context.getBean(JobRecommendationRepository.class);
        outboxRepository = context.getBean(OutboxEventRepository.class);
        companyFollowRepository = context.getBean(CompanyFollowRepository.class);
        transactionManager = context.getBean(RecordingTransactionManager.class);

        when(recommendationRepository.countBySubscriber_IdAndStatus(anyLong(), eq(RecommendationStatus.PENDING)))
                .thenReturn(0L);
        when(recommendationRepository.existsBySubscriber_IdAndJob_Id(anyLong(), anyLong())).thenReturn(false);
        when(recommendationRepository.saveAll(any())).thenAnswer(invocation -> {
            List<JobRecommendation> recommendations = StreamSupport
                    .stream(((Iterable<JobRecommendation>) invocation.getArgument(0)).spliterator(), false)
                    .toList();
            long id = 1;
            for (JobRecommendation recommendation : recommendations) {
                recommendation.setId(id++);
            }
            return recommendations;
        });
        when(outboxRepository.saveAll(any())).thenAnswer(invocation -> StreamSupport
                .stream(((Iterable<OutboxEvent>) invocation.getArgument(0)).spliterator(), false)
                .toList());
        when(companyFollowRepository.findFollowedCompanyIdsByEmail(any())).thenReturn(List.of());
    }

    @AfterEach
    void tearDown() {
        context.close();
    }

    @Test
    void savesRecommendationsAndOneOutboxEventForEachSubscriberInOneProxiedTransaction() throws Exception {
        Skill skill = skill(3L, "Java");
        Subscriber first = subscriber(11L, "first@example.test", skill);
        Subscriber second = subscriber(12L, "second@example.test", skill);
        Company company = new Company();
        company.setId(21L);
        when(companyFollowRepository.findFollowedCompanyIdsByEmail("first@example.test"))
                .thenReturn(List.of(21L));

        int created = service.createRecommendationsForBatch(
                List.of(first, second), List.of(job(31L, skill, company)), config());

        assertTrue(AopUtils.isAopProxy(service));
        assertEquals(2, created);
        assertEquals(1, transactionManager.begins.get());
        assertEquals(1, transactionManager.commits.get());
        assertEquals(0, transactionManager.rollbacks.get());

        org.mockito.ArgumentCaptor<Iterable<OutboxEvent>> captor = org.mockito.ArgumentCaptor.forClass(Iterable.class);
        verify(outboxRepository).saveAll(captor.capture());
        List<OutboxEvent> events = StreamSupport.stream(captor.getValue().spliterator(), false).toList();

        assertEquals(2, events.size());
        assertEquals(List.of(11L, 12L), events.stream().map(OutboxEvent::getAggregateId).sorted().toList());
        assertTrue(events.stream().allMatch(event -> event.getStatus() == OutboxStatus.PENDING));
        assertTrue(events.stream().allMatch(event -> event.getRetryCount() == 0 && event.getNextAttemptAt() != null));
        assertTrue(events.stream().allMatch(event -> event.getPayload().contains("recommendationIds")));

        RecommendationEmailMessage firstPayload = new ObjectMapper().readValue(
                events.stream().filter(event -> event.getAggregateId() == 11L).findFirst().orElseThrow().getPayload(),
                RecommendationEmailMessage.class);
        assertEquals("first@example.test", firstPayload.getSubscriberEmail());
        assertEquals(List.of(1L), firstPayload.getRecommendationIds());

        org.mockito.ArgumentCaptor<Iterable<JobRecommendation>> recommendationCaptor =
                org.mockito.ArgumentCaptor.forClass(Iterable.class);
        verify(recommendationRepository).saveAll(recommendationCaptor.capture());
        List<JobRecommendation> saved = StreamSupport
                .stream(recommendationCaptor.getValue().spliterator(), false).toList();
        assertEquals(2, saved.size());
        assertTrue(saved.stream().allMatch(recommendation ->
                recommendation.getStatus() == RecommendationStatus.PENDING
                        && recommendation.getEmailStatus() == EmailStatus.PENDING));
        JobRecommendation followedCompanyRecommendation = saved.stream()
                .filter(recommendation -> recommendation.getSubscriber().getId() == 11L)
                .findFirst().orElseThrow();
        assertEquals(75.0, followedCompanyRecommendation.getMatchScore());
        assertTrue(followedCompanyRecommendation.getReason().contains("following company"));
        assertEquals("[\"Java\"]", followedCompanyRecommendation.getMatchedSkills());
    }

    @Test
    void recommendationSaveFailureRollsBackAndDoesNotCreateOutboxEvents() {
        doThrow(new IllegalStateException("recommendation failure"))
                .when(recommendationRepository).saveAll(any());

        org.junit.jupiter.api.Assertions.assertThrows(IllegalStateException.class,
                () -> service.createRecommendationsForBatch(
                        List.of(subscriber(11L, "candidate@example.test", skill(3L, "Java"))),
                        List.of(job(31L, skill(3L, "Java"), null)), config()));

        assertEquals(1, transactionManager.rollbacks.get());
        verify(outboxRepository, never()).saveAll(any());
    }

    @Test
    void outboxSaveFailureRollsBackRecommendationBatch() {
        doThrow(new IllegalStateException("outbox failure")).when(outboxRepository).saveAll(any());

        org.junit.jupiter.api.Assertions.assertThrows(IllegalStateException.class,
                () -> service.createRecommendationsForBatch(
                        List.of(subscriber(11L, "candidate@example.test", skill(3L, "Java"))),
                        List.of(job(31L, skill(3L, "Java"), null)), config()));

        assertEquals(1, transactionManager.rollbacks.get());
        verify(recommendationRepository).saveAll(any());
        assertEquals(0, transactionManager.commits.get());
    }

    @Test
    void skipDuplicateConfigurationStillSkipsExistingSubscriberJobPair() {
        Skill skill = skill(3L, "Java");
        when(recommendationRepository.existsBySubscriber_IdAndJob_Id(11L, 31L)).thenReturn(true);

        int created = service.createRecommendationsForBatch(
                List.of(subscriber(11L, "candidate@example.test", skill)),
                List.of(job(31L, skill, null)), config());

        assertEquals(0, created);
        verify(recommendationRepository, never()).saveAll(any());
        verify(outboxRepository, never()).saveAll(any());
        assertEquals(1, transactionManager.commits.get());
    }

    @Test
    void createsIndependentOutboxEventsForMultipleSubscribers() {
        Skill skill = skill(3L, "Java");

        service.createRecommendationsForBatch(
                List.of(subscriber(11L, "first@example.test", skill), subscriber(12L, "second@example.test", skill)),
                List.of(job(31L, skill, null)), config());

        org.mockito.ArgumentCaptor<Iterable<OutboxEvent>> captor = org.mockito.ArgumentCaptor.forClass(Iterable.class);
        verify(outboxRepository).saveAll(captor.capture());
        List<OutboxEvent> events = StreamSupport.stream(captor.getValue().spliterator(), false).toList();
        assertEquals(2, events.size());
        assertEquals(List.of(11L, 12L), events.stream().map(OutboxEvent::getAggregateId).sorted().toList());
    }

    private static CronJob config() {
        return CronJob.builder()
                .maxJobsPerSubscriber(10)
                .skipDuplicates(true)
                .minMatchPercentage(60)
                .skillMatchWeight(60)
                .companyFollowWeight(15)
                .industryWeight(10)
                .locationWeight(10)
                .salaryWeight(5)
                .build();
    }

    private static Skill skill(long id, String name) {
        Skill skill = new Skill();
        skill.setId(id);
        skill.setName(name);
        return skill;
    }

    private static Subscriber subscriber(long id, String email, Skill skill) {
        Subscriber subscriber = new Subscriber();
        subscriber.setId(id);
        subscriber.setEmail(email);
        SubscriberSkill subscriberSkill = new SubscriberSkill();
        subscriberSkill.setSubscriber(subscriber);
        subscriberSkill.setSkill(skill);
        subscriber.setSubscriberSkills(new ArrayList<>(List.of(subscriberSkill)));
        return subscriber;
    }

    private static Job job(long id, Skill skill, Company company) {
        Job job = new Job();
        job.setId(id);
        job.setCompany(company);
        JobSkill jobSkill = new JobSkill();
        jobSkill.setJob(job);
        jobSkill.setSkill(skill);
        job.setJobSkills(new ArrayList<>(List.of(jobSkill)));
        return job;
    }

    @Configuration
    @EnableTransactionManagement(proxyTargetClass = true)
    static class TestConfiguration {

        @Bean
        RecordingTransactionManager transactionManager() {
            return new RecordingTransactionManager();
        }

        @Bean
        JobRecommendationRepository jobRecommendationRepository() {
            return org.mockito.Mockito.mock(JobRecommendationRepository.class);
        }

        @Bean
        CompanyFollowRepository companyFollowRepository() {
            return org.mockito.Mockito.mock(CompanyFollowRepository.class);
        }

        @Bean
        OutboxEventRepository outboxEventRepository() {
            return org.mockito.Mockito.mock(OutboxEventRepository.class);
        }

        @Bean
        ObjectMapper objectMapper() {
            return new ObjectMapper();
        }

        @Bean
        OutboxEventService outboxEventService(OutboxEventRepository repository, ObjectMapper mapper) {
            return new OutboxEventService(repository, mapper);
        }

        @Bean
        RecommendationGenerationBatchService recommendationGenerationBatchService(
                JobRecommendationRepository recommendationRepository,
                CompanyFollowRepository followRepository,
                OutboxEventService outboxEventService,
                ObjectMapper mapper) {
            return new RecommendationGenerationBatchService(
                    recommendationRepository, followRepository, outboxEventService, mapper);
        }
    }

    static class RecordingTransactionManager extends AbstractPlatformTransactionManager {
        private final AtomicInteger begins = new AtomicInteger();
        private final AtomicInteger commits = new AtomicInteger();
        private final AtomicInteger rollbacks = new AtomicInteger();
        private final ThreadLocal<TransactionState> currentTransaction = new ThreadLocal<>();

        @Override
        protected Object doGetTransaction() {
            TransactionState existing = currentTransaction.get();
            return existing == null ? new TransactionState() : existing;
        }

        @Override
        protected boolean isExistingTransaction(Object transaction) {
            return ((TransactionState) transaction).active;
        }

        @Override
        protected void doBegin(Object transaction, TransactionDefinition definition) {
            ((TransactionState) transaction).active = true;
            currentTransaction.set((TransactionState) transaction);
            begins.incrementAndGet();
        }

        @Override
        protected void doCommit(DefaultTransactionStatus status) {
            commits.incrementAndGet();
        }

        @Override
        protected void doRollback(DefaultTransactionStatus status) {
            rollbacks.incrementAndGet();
        }

        @Override
        protected void doSetRollbackOnly(DefaultTransactionStatus status) {
            ((TransactionState) status.getTransaction()).rollbackOnly = true;
        }

        @Override
        protected void doCleanupAfterCompletion(Object transaction) {
            currentTransaction.remove();
        }
    }

    static class TransactionState {
        private boolean active;
        private boolean rollbackOnly;
    }
}
