package vn.phantruongan.backend.resume.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import io.micrometer.common.lang.Nullable;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Join;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.resume.dtos.req.GetListResumeReqDTO;
import vn.phantruongan.backend.resume.entities.Resume;

public class ResumeSpecification implements Specification<Resume> {

    private final GetListResumeReqDTO dtoFilter;
    private final Long ownerUserId;
    private final boolean employerScope;

    public ResumeSpecification(GetListResumeReqDTO dtoFilter) {
        this(dtoFilter, null, false);
    }

    public ResumeSpecification(GetListResumeReqDTO dtoFilter, Long ownerUserId, boolean employerScope) {
        this.dtoFilter = dtoFilter;
        this.ownerUserId = ownerUserId;
        this.employerScope = employerScope;
    }

    @Override
    @Nullable
    public Predicate toPredicate(Root<Resume> root, @Nullable CriteriaQuery<?> query, CriteriaBuilder cb) {
        List<Predicate> predicates = new ArrayList<>();

        if (ownerUserId != null) {
            if (employerScope) {
                Join<Resume, Job> jobJoin = root.join("job");
                Join<Job, Company> companyJoin = jobJoin.join("company");
                Join<Company, User> userJoin = companyJoin.join("users");
                predicates.add(cb.equal(userJoin.get("id"), ownerUserId));
            } else {
                predicates.add(cb.equal(root.join("user").get("id"), ownerUserId));
            }
            if (query != null) query.distinct(true);
        }

        if (dtoFilter.getCandidateName() != null && !dtoFilter.getCandidateName().isBlank()) {
            predicates.add(cb.like(
                    cb.lower(root.get("candidateName")),
                    "%" + dtoFilter.getCandidateName().toLowerCase().trim() + "%"));
        }

        if (dtoFilter.getEmail() != null && !dtoFilter.getEmail().isBlank()) {
            predicates.add(cb.like(
                    cb.lower(root.get("email")),
                    "%" + dtoFilter.getEmail().toLowerCase().trim() + "%"));
        }

        if (dtoFilter.getPhoneNumber() != null && !dtoFilter.getPhoneNumber().isBlank()) {
            predicates.add(cb.like(
                    cb.lower(root.get("phoneNumber")),
                    "%" + dtoFilter.getPhoneNumber().toLowerCase().trim() + "%"));
        }

        if (dtoFilter.getStatus() != null) {
            predicates.add(cb.equal(root.get("status"), dtoFilter.getStatus()));
        }

        return cb.and(predicates.toArray(new Predicate[0]));
    }
}
