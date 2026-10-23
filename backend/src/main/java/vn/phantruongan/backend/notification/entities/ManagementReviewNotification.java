package vn.phantruongan.backend.notification.entities;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.common.Auditable;

@Entity
@Table(name = "management_review_notifications", indexes = {
        @Index(name = "idx_mgmt_review_reviewer_pending", columnList = "reviewer_id, resolved_at, created_at")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_mgmt_review_deduplication_key", columnNames = "deduplication_key")
})
@Getter
@Setter
public class ManagementReviewNotification extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @Column(name = "review_type", nullable = false, length = 40)
    private String reviewType;

    @Column(name = "target_id", nullable = false)
    private Long targetId;

    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "company_name", length = 255)
    private String companyName;

    @Column(name = "job_id")
    private Long jobId;

    @Column(name = "job_title", length = 255)
    private String jobTitle;

    @Column(name = "review_status", length = 40)
    private String reviewStatus;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @Column(name = "deduplication_key", nullable = false, length = 160)
    private String deduplicationKey;
}
