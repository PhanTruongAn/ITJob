package vn.phantruongan.backend.outbox.repositories;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.LockModeType;
import jakarta.persistence.QueryHint;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.outbox.entities.OutboxEvent;

@Repository
public interface OutboxEventRepository extends JpaRepository<OutboxEvent, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints(@QueryHint(name = "jakarta.persistence.lock.timeout", value = "-2"))
    @Query("""
            SELECT event FROM OutboxEvent event
            WHERE event.eventType = :eventType
              AND event.status = vn.phantruongan.backend.outbox.enums.OutboxStatus.PENDING
              AND event.nextAttemptAt <= :now
              AND (event.claimToken IS NULL OR event.claimedAt <= :leaseExpiredAt)
            ORDER BY event.id ASC
            """)
    List<OutboxEvent> findDueEventsForClaim(
            @Param("eventType") String eventType,
            @Param("now") Instant now,
            @Param("leaseExpiredAt") Instant leaseExpiredAt,
            Pageable pageable);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            UPDATE OutboxEvent event
            SET event.status = vn.phantruongan.backend.outbox.enums.OutboxStatus.PUBLISHED,
                event.publishedAt = :publishedAt,
                event.claimedAt = NULL,
                event.claimToken = NULL,
                event.lastError = NULL
            WHERE event.id = :id
              AND event.status = vn.phantruongan.backend.outbox.enums.OutboxStatus.PENDING
              AND event.claimToken = :claimToken
            """)
    int markPublishedIfClaimed(
            @Param("id") Long id,
            @Param("claimToken") UUID claimToken,
            @Param("publishedAt") Instant publishedAt);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            UPDATE OutboxEvent event
            SET event.status = vn.phantruongan.backend.outbox.enums.OutboxStatus.PENDING,
                event.retryCount = event.retryCount + 1,
                event.nextAttemptAt = :nextAttemptAt,
                event.lastError = :lastError,
                event.claimedAt = NULL,
                event.claimToken = NULL
            WHERE event.id = :id
              AND event.status = vn.phantruongan.backend.outbox.enums.OutboxStatus.PENDING
              AND event.claimToken = :claimToken
            """)
    int rescheduleIfClaimed(
            @Param("id") Long id,
            @Param("claimToken") UUID claimToken,
            @Param("nextAttemptAt") Instant nextAttemptAt,
            @Param("lastError") String lastError);
}
