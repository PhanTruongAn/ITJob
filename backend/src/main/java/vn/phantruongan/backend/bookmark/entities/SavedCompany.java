package vn.phantruongan.backend.bookmark.entities;

import jakarta.persistence.Entity;
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
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.common.Auditable;
import vn.phantruongan.backend.company.entities.Company;

@Entity
@Table(name = "saved_companies", indexes = {
        @Index(name = "idx_savedcompany_candidate", columnList = "candidate_id")
})
@Getter
@Setter
@ToString
public class SavedCompany extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
}
