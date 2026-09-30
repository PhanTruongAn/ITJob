package vn.phantruongan.backend.outbox.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import vn.phantruongan.backend.outbox.entities.OutboxEvent;
import vn.phantruongan.backend.outbox.enums.OutboxStatus;

@SpringBootTest
class OutboxEventClaimIntegrationTest {

    private static final String TEST_EVENT_TYPE = "OUTBOX_LOCK_INTEGRATION_TEST";

    @Autowired
    private OutboxEventRepository outboxEventRepository;

    @Autowired
    private PlatformTransactionManager transactionManager;

    @Test
    void concurrentClaimsSkipRowsLockedByAnotherPublisher() throws Exception {
        OutboxEvent event = dueEvent();
        event = outboxEventRepository.saveAndFlush(event);
        Long eventId = event.getId();

        CountDownLatch firstTransactionHasLock = new CountDownLatch(1);
        CountDownLatch releaseFirstTransaction = new CountDownLatch(1);
        ExecutorService executor = Executors.newFixedThreadPool(2);
        TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);
        Future<Integer> firstClaim = executor.submit(() -> transactionTemplate.execute(status -> {
            List<OutboxEvent> rows = outboxEventRepository.findDueEventsForClaim(
                    TEST_EVENT_TYPE, Instant.now(), Instant.now().minusSeconds(120), PageRequest.of(0, 10));
            firstTransactionHasLock.countDown();
            await(releaseFirstTransaction);
            rows.forEach(row -> {
                row.setClaimToken(UUID.randomUUID());
                row.setClaimedAt(Instant.now());
            });
            return rows.size();
        }));

        try {
            assertTrue(firstTransactionHasLock.await(10, TimeUnit.SECONDS), "first claim did not acquire its lock");
            Future<Integer> secondClaim = executor.submit(() -> transactionTemplate.execute(status ->
                    outboxEventRepository.findDueEventsForClaim(
                            TEST_EVENT_TYPE, Instant.now(), Instant.now().minusSeconds(120), PageRequest.of(0, 10)).size()));

            int secondClaimed;
            try {
                secondClaimed = secondClaim.get(3, TimeUnit.SECONDS);
            } catch (TimeoutException e) {
                throw new AssertionError("second publisher waited on a locked outbox row instead of skipping it", e);
            }

            assertEquals(0, secondClaimed);
        } finally {
            releaseFirstTransaction.countDown();
            try {
                firstClaim.get(10, TimeUnit.SECONDS);
            } catch (Exception ignored) {
                // The original assertion/failure is more useful; still clean up the test row below.
            }
            executor.shutdownNow();
            outboxEventRepository.deleteById(eventId);
        }

        assertEquals(1, firstClaim.get(10, TimeUnit.SECONDS));
        assertFalse(outboxEventRepository.existsById(eventId));
    }

    @Test
    void futureNextAttemptIsNotReturnedForClaim() {
        OutboxEvent event = dueEvent();
        event.setEventType("OUTBOX_FUTURE_INTEGRATION_TEST");
        event.setNextAttemptAt(Instant.now().plusSeconds(300));
        event = outboxEventRepository.saveAndFlush(event);
        Long eventId = event.getId();
        String eventType = event.getEventType();

        try {
            List<OutboxEvent> due = new TransactionTemplate(transactionManager).execute(status ->
                    outboxEventRepository.findDueEventsForClaim(
                            eventType, Instant.now(), Instant.now().minusSeconds(120), PageRequest.of(0, 10)));

            assertTrue(due != null);
            assertTrue(due.stream().noneMatch(candidate -> candidate.getId().equals(eventId)));
        } finally {
            outboxEventRepository.deleteById(eventId);
        }
    }

    private OutboxEvent dueEvent() {
        OutboxEvent event = new OutboxEvent();
        event.setEventType(TEST_EVENT_TYPE);
        event.setAggregateType("SUBSCRIBER");
        event.setAggregateId(987654321L);
        event.setPayload("{}");
        event.setStatus(OutboxStatus.PENDING);
        event.setNextAttemptAt(Instant.now().minusSeconds(10));
        return event;
    }

    private static void await(CountDownLatch latch) {
        try {
            if (!latch.await(10, TimeUnit.SECONDS)) {
                throw new IllegalStateException("timed out waiting to release outbox lock");
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("interrupted while holding outbox lock", e);
        }
    }
}
