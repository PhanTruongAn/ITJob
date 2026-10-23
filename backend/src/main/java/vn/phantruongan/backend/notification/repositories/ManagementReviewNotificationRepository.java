package vn.phantruongan.backend.notification.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.notification.entities.ManagementReviewNotification;

@Repository
public interface ManagementReviewNotificationRepository
        extends JpaRepository<ManagementReviewNotification, Long> {

    Optional<ManagementReviewNotification> findByDeduplicationKey(String deduplicationKey);

    Page<ManagementReviewNotification> findByReviewer_IdAndResolvedAtIsNullOrderByCreatedAtDescIdDesc(
            Long reviewerId, Pageable pageable);

    long countByReviewer_IdAndResolvedAtIsNull(Long reviewerId);

    @Modifying
    @Query("UPDATE ManagementReviewNotification n SET n.resolvedAt = CURRENT_TIMESTAMP "
            + "WHERE n.reviewType = :reviewType AND n.targetId = :targetId AND n.resolvedAt IS NULL")
    int resolvePending(@Param("reviewType") String reviewType, @Param("targetId") Long targetId);
}
