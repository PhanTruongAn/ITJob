package vn.phantruongan.backend.recommendation.entities;

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
import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.recommendation.enums.RecommendationStatus;
import vn.phantruongan.backend.subscriber.entities.Subscriber;

@Entity
@Table(name = "company_recommendations", indexes = {
        @Index(name = "idx_company_rec_subscriber", columnList = "subscriber_id"),
        @Index(name = "idx_company_rec_company", columnList = "company_id"),
        @Index(name = "idx_company_rec_status", columnList = "status")
})
@Getter
@Setter
@ToString
public class CompanyRecommendation extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscriber_id")
    @ToString.Exclude
    private Subscriber subscriber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    @ToString.Exclude
    private Company company;

    @Enumerated(EnumType.STRING)
    private RecommendationStatus status = RecommendationStatus.PENDING;
}
