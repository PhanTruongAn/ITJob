package vn.phantruongan.backend.recommendation.entities;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.recommendation.enums.EmailDeliveryStatus;

@Entity
@Table(name = "recommendation_email_deliveries", indexes = {
        @Index(name = "idx_email_delivery_status_updated", columnList = "status,updated_at")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_email_delivery_identity", columnNames = "delivery_identity")
})
@Getter
@Setter
public class RecommendationEmailDelivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "delivery_identity", nullable = false, length = 255)
    private String deliveryIdentity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EmailDeliveryStatus status;

    @Column(nullable = false)
    private int attempt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "claimed_at")
    private Instant claimedAt;

    @Column(name = "sent_at")
    private Instant sentAt;

    @Column(name = "failure_category", length = 100)
    private String failureCategory;

    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;
}
