package vn.phantruongan.backend.recommendation.repositories;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import vn.phantruongan.backend.recommendation.entities.JobRecommendation;
import vn.phantruongan.backend.recommendation.enums.EmailStatus;
import vn.phantruongan.backend.recommendation.enums.RecommendationStatus;

@Repository
public interface JobRecommendationRepository
        extends JpaRepository<JobRecommendation, Long>, JpaSpecificationExecutor<JobRecommendation> {

    @EntityGraph(attributePaths = { "subscriber", "job", "job.company" })
    @Query("SELECT r FROM JobRecommendation r WHERE r.subscriber.id = :subscriberId")
    Page<JobRecommendation> findAllBySubscriberId(@Param("subscriberId") Long subscriberId, Pageable pageable);

    boolean existsBySubscriber_IdAndJob_Id(Long subscriberId, Long jobId);

    long countBySubscriber_IdAndStatus(Long subscriberId, RecommendationStatus status);

    @EntityGraph(attributePaths = { "subscriber", "job", "job.company" })
    Optional<JobRecommendation> findById(Long id);

    @Modifying
    @Transactional
    @Query("UPDATE JobRecommendation r SET r.emailStatus = :emailStatus WHERE r.id IN :ids")
    void updateEmailStatusByIds(@Param("ids") List<Long> ids, @Param("emailStatus") EmailStatus emailStatus);

    @Modifying
    @Transactional
    @Query("UPDATE JobRecommendation r SET r.emailStatus = :emailStatus, r.sentAt = :sentAt WHERE r.id IN :ids")
    void updateEmailStatusAndSentAtByIds(@Param("ids") List<Long> ids, @Param("emailStatus") EmailStatus emailStatus, @Param("sentAt") Instant sentAt);

    @Modifying
    @Transactional
    @Query("UPDATE JobRecommendation r SET r.emailStatus = :emailStatus, r.retryCount = :retryCount WHERE r.id IN :ids")
    void updateEmailStatusAndRetryCountByIds(@Param("ids") List<Long> ids, @Param("emailStatus") EmailStatus emailStatus, @Param("retryCount") Integer retryCount);

    @EntityGraph(attributePaths = { "subscriber", "job", "job.company" })
    List<JobRecommendation> findTop500ByEmailStatusOrderByIdAsc(EmailStatus emailStatus);

    @EntityGraph(attributePaths = { "subscriber", "job", "job.company" })
    @Query("""
            SELECT r FROM JobRecommendation r
            WHERE r.emailStatus = vn.phantruongan.backend.recommendation.enums.EmailStatus.PENDING
              AND r.retryCount > 0
              AND r.createdAt < :cutoff
            """)
    List<JobRecommendation> findPendingForReconciliation(@Param("cutoff") Instant cutoff);

    @EntityGraph(attributePaths = { "subscriber", "job", "job.company" })
    List<JobRecommendation> findAllByIdIn(List<Long> ids);
}
