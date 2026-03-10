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

    @Builder.Default
    private Integer minMatchPercentage = 60;

    @Builder.Default
    private Boolean onlyLast24h = true;

    @Builder.Default
    private Integer maxJobsPerSubscriber = 10;
}
