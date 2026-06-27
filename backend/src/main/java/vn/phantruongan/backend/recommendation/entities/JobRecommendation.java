package vn.phantruongan.backend.recommendation.entities;

import java.time.Instant;

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
import lombok.ToString;
import vn.phantruongan.backend.common.Auditable;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.recommendation.enums.EmailStatus;
import vn.phantruongan.backend.recommendation.enums.RecommendationStatus;
import vn.phantruongan.backend.subscriber.entities.Subscriber;

@Entity
@Table(name = "job_recommendations", indexes = {
        @Index(name = "idx_recommend_subscriber", columnList = "subscriber_id"),
        @Index(name = "idx_recommend_job", columnList = "job_id"),
        @Index(name = "idx_recommend_status", columnList = "status"),
        @Index(name = "idx_recommend_created_at", columnList = "created_at"),
        @Index(name = "idx_recommend_match_score", columnList = "match_score")
})
@Getter
@Setter
@ToString
public class JobRecommendation extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscriber_id")
    @ToString.Exclude
    private Subscriber subscriber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id")
    @ToString.Exclude
    private Job job;

    @Enumerated(EnumType.STRING)
    private RecommendationStatus status = RecommendationStatus.PENDING;

    @Enumerated(EnumType.STRING)
    private EmailStatus emailStatus = EmailStatus.PENDING;

    @Column(name = "match_score")
    private Double matchScore;

    @Column(name = "matched_skills", columnDefinition = "TEXT")
    private String matchedSkills; // JSON array, e.g. ["Java","Spring Boot","Docker"]

    @Column(columnDefinition = "TEXT")
    private String reason; // e.g. "Matched 4/5 required skills"

    @Column(name = "sent_at")
    private Instant sentAt;

    @Column(name = "retry_count", nullable = false)
    private Integer retryCount = 0;
}
