package vn.phantruongan.backend.resume.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import io.micrometer.common.lang.Nullable;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import vn.phantruongan.backend.resume.dtos.req.GetListResumeReqDTO;
import vn.phantruongan.backend.resume.entities.Resume;

public class ResumeSpecification implements Specification<Resume> {

    private final GetListResumeReqDTO dtoFilter;

    public ResumeSpecification(GetListResumeReqDTO dtoFilter) {
        this.dtoFilter = dtoFilter;
    }

    @Override
    @Nullable
    public Predicate toPredicate(Root<Resume> root, @Nullable CriteriaQuery<?> query, CriteriaBuilder cb) {
        List<Predicate> predicates = new ArrayList<>();

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
