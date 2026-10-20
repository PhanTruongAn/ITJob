package vn.phantruongan.backend.notification.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.common.Auditable;
import vn.phantruongan.backend.notification.enums.NotificationType;
import vn.phantruongan.backend.resume.enums.ResumeEnum;

@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_notification_user_created", columnList = "user_id, created_at"),
        @Index(name = "idx_notification_user_read", columnList = "user_id, is_read"),
        @Index(name = "uk_notification_deduplication_key", columnList = "deduplication_key", unique = true)
})
@Getter
@Setter
public class Notification extends Auditable {

    public static final String APPLICATION_RECEIVED_CATEGORY = "APPLICATION_RECEIVED";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private NotificationType type;

    /** Text category avoids changing the persisted enum constraint on existing databases. */
    @Column(name = "event_category", length = 40)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(name = "application_status", length = 20)
    private ResumeEnum applicationStatus;

    @Column(name = "related_resume_id", nullable = false)
    private Long relatedResumeId;

    @Column(name = "job_id")
    private Long jobId;

    @Column(name = "job_title", length = 255)
    private String jobTitle;

    @Column(name = "candidate_name", length = 255)
    private String candidateName;

    /** Set only for application-received events to make notification creation idempotent. */
    @Column(name = "deduplication_key", length = 160)
    private String deduplicationKey;

    @Column(name = "is_read", nullable = false)
    private boolean read;
}
