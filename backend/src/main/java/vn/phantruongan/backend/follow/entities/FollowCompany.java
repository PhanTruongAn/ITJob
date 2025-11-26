package vn.phantruongan.backend.follow.entities;

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
import lombok.ToString;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.common.Auditable;
import vn.phantruongan.backend.company.entities.Company;

@Entity
@Table(name = "follow_companies", uniqueConstraints = {
                @UniqueConstraint(name = "uk_follow_candidate_company", columnNames = { "candidate_id", "company_id" })
}, indexes = {
                @Index(name = "idx_follow_company", columnList = "company_id"),
                @Index(name = "idx_follow_candidate", columnList = "candidate_id"),
                @Index(name = "idx_follow_candidate_company", columnList = "candidate_id, company_id")
})
@Getter
@Setter
@ToString
public class FollowCompany extends Auditable {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "candidate_id", nullable = false)
        @ToString.Exclude
        private User candidate;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "company_id", nullable = false)
        @ToString.Exclude
        private Company company;

        @Column(nullable = false)
        private boolean active = true;

}