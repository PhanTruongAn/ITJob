package vn.phantruongan.backend.outbox.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.lang.reflect.Method;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.jpa.repository.Query;

import com.fasterxml.jackson.databind.ObjectMapper;

import vn.phantruongan.backend.outbox.entities.OutboxEvent;
import vn.phantruongan.backend.outbox.enums.OutboxStatus;
import vn.phantruongan.backend.outbox.repositories.OutboxEventRepository;
import jakarta.persistence.LockModeType;
import jakarta.persistence.QueryHint;

@ExtendWith(MockitoExtension.class)
class OutboxEventServiceTest {

    @Mock
    private OutboxEventRepository outboxEventRepository;

    private OutboxEventService service;

    @BeforeEach
    void setUp() {
        service = new OutboxEventService(outboxEventRepository, new ObjectMapper());
    }

    @Test
    void claimsDueEventsWithLeaseAndBoundedPage() {
        OutboxEvent event = new OutboxEvent();
        event.setId(1L);
        event.setStatus(OutboxStatus.PENDING);
        when(outboxEventRepository.findDueEventsForClaim(any(), any(), any(), any())).thenReturn(List.of(event));

        List<OutboxEvent> claimed = service.claimDueEvents(10, Duration.ofSeconds(120));

        assertEquals(1, claimed.size());
        assertEquals(OutboxStatus.PENDING, event.getStatus());
        assertNotNull(event.getClaimedAt());
        assertNotNull(event.getClaimToken());

        ArgumentCaptor<Instant> nowCaptor = ArgumentCaptor.forClass(Instant.class);
        ArgumentCaptor<Instant> leaseCaptor = ArgumentCaptor.forClass(Instant.class);
        ArgumentCaptor<PageRequest> pageCaptor = ArgumentCaptor.forClass(PageRequest.class);
        verify(outboxEventRepository).findDueEventsForClaim(
                eq(OutboxEventService.RECOMMENDATION_EMAIL_EVENT),
                nowCaptor.capture(), leaseCaptor.capture(), pageCaptor.capture());
        assertTrue(leaseCaptor.getValue().isBefore(nowCaptor.getValue()));
        assertEquals(120, Duration.between(leaseCaptor.getValue(), nowCaptor.getValue()).toSeconds());
        assertEquals(10, pageCaptor.getValue().getPageSize());
    }

    @Test
    void emptyClaimLeavesFutureRetrySelectionToRepositoryPredicate() {
        when(outboxEventRepository.findDueEventsForClaim(any(), any(), any(), any())).thenReturn(List.of());

        List<OutboxEvent> claimed = service.claimDueEvents(10, Duration.ofMinutes(2));

        assertTrue(claimed.isEmpty());
        verify(outboxEventRepository).findDueEventsForClaim(
                eq(OutboxEventService.RECOMMENDATION_EMAIL_EVENT), any(Instant.class), any(Instant.class), any());
    }

    @Test
    void claimQueryUsesSkipLockedPessimisticWriteLock() throws Exception {
        Method queryMethod = OutboxEventRepository.class.getMethod(
                "findDueEventsForClaim", String.class, Instant.class, Instant.class,
                org.springframework.data.domain.Pageable.class);

        assertEquals(LockModeType.PESSIMISTIC_WRITE, queryMethod.getAnnotation(Lock.class).value());
        String jpql = queryMethod.getAnnotation(Query.class).value();
        assertTrue(jpql.contains("event.nextAttemptAt <= :now"));
        assertTrue(jpql.contains("event.claimedAt <= :leaseExpiredAt"));
        QueryHints hints = queryMethod.getAnnotation(QueryHints.class);
        assertNotNull(hints);
        assertTrue(List.of(hints.value()).stream()
                .map(QueryHint::value)
                .anyMatch("-2"::equals));
    }
}
