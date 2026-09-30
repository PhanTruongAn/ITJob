package vn.phantruongan.backend.recommendation.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import vn.phantruongan.backend.recommendation.entities.RecommendationEmailDelivery;

@Repository
public interface RecommendationEmailDeliveryRepository
        extends JpaRepository<RecommendationEmailDelivery, Long> {

    @Modifying
    @Transactional
    @Query(value = """
            INSERT INTO recommendation_email_deliveries
                (delivery_identity, status, attempt, created_at, updated_at, claimed_at)
            VALUES (:identity, 'PROCESSING', :attempt, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT (delivery_identity) DO NOTHING
            """, nativeQuery = true)
    int insertProcessingIfAbsent(@Param("identity") String identity, @Param("attempt") int attempt);

    @Modifying
    @Transactional
    @Query(value = """
            UPDATE recommendation_email_deliveries
            SET status = 'PROCESSING', attempt = :attempt,
                updated_at = CURRENT_TIMESTAMP, claimed_at = CURRENT_TIMESTAMP,
                failure_category = NULL, failure_reason = NULL
            WHERE delivery_identity = :identity AND status = 'PENDING'
            """, nativeQuery = true)
    int claimPending(@Param("identity") String identity, @Param("attempt") int attempt);

    @Modifying
    @Transactional
    @Query(value = """
            UPDATE recommendation_email_deliveries
            SET status = 'FAILED', updated_at = CURRENT_TIMESTAMP,
                failure_category = :failureCategory, failure_reason = :failureReason
            WHERE delivery_identity = :identity AND status = 'PENDING'
            """, nativeQuery = true)
    int failPending(@Param("identity") String identity,
            @Param("failureCategory") String failureCategory,
            @Param("failureReason") String failureReason);

    java.util.Optional<RecommendationEmailDelivery> findByDeliveryIdentity(String deliveryIdentity);

    long countByDeliveryIdentity(String deliveryIdentity);

    @Transactional
    void deleteByDeliveryIdentity(String deliveryIdentity);
}
