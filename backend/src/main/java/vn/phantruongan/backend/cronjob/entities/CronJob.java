package vn.phantruongan.backend.cronjob.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.phantruongan.backend.common.Auditable;

@Entity
@Table(name = "cron_jobs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CronJob extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String cronExpression;
    private Boolean isEnabled;

    // ========== Recommendation Rules ==========

    @Builder.Default
    private Integer minMatchPercentage = 60;

    @Builder.Default
    private Boolean onlyLast24h = true;

    @Builder.Default
    private Integer maxJobsPerSubscriber = 10;

    /** Skip jobs whose endDate has passed */
    @Builder.Default
    private Boolean skipExpiredJobs = true;

    /** Skip jobs that are marked inactive */
    @Builder.Default
    private Boolean skipInactiveJobs = true;

    /** Skip jobs the subscriber has already applied to */
    @Builder.Default
    private Boolean skipAppliedJobs = false;

    /** Skip jobs that have already been recommended to this subscriber */
    @Builder.Default
    private Boolean skipDuplicates = true;

    // ========== Recommendation Strategy Weights (must total 100) ==========

    /** Weight for skill matching (default 60%) */
    @Builder.Default
    private Integer skillMatchWeight = 60;

    /** Weight for company follow bonus (default 15%) */
    @Builder.Default
    private Integer companyFollowWeight = 15;

    /** Weight for industry match (default 10%) */
    @Builder.Default
    private Integer industryWeight = 10;

    /** Weight for location match (default 10%) */
    @Builder.Default
    private Integer locationWeight = 10;

    /** Weight for salary range match (default 5%) */
    @Builder.Default
    private Integer salaryWeight = 5;
}
