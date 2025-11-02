package vn.phantruongan.backend.job.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.job.dtos.req.job.GetListJobReqDTO;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.job.entities.JobSkill;

public class JobSpecification implements Specification<Job> {

    private final GetListJobReqDTO dtoFilter;

    public JobSpecification(GetListJobReqDTO dtoFilter) {
        this.dtoFilter = dtoFilter;
    }

    // Implementation details would go here
    @Override
    @Nullable
    public Predicate toPredicate(Root<Job> root, @Nullable CriteriaQuery<?> query, CriteriaBuilder cb) {
        List<Predicate> predicates = new ArrayList<>();

        if (dtoFilter.getName() != null && !dtoFilter.getName().isBlank()) {
            predicates.add(cb.like(cb.lower(root.get("name")), "%" + dtoFilter.getName().toLowerCase().trim() + "%"));
        }

        if (dtoFilter.getLocation() != null && !dtoFilter.getLocation().isBlank()) {
            predicates.add(
                    cb.like(cb.lower(root.get("location")), "%" + dtoFilter.getLocation().toLowerCase().trim() + "%"));
        }

        if (dtoFilter.getMinSalary() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("salary"), dtoFilter.getMinSalary()));
        }

        if (dtoFilter.getMaxSalary() != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("salary"), dtoFilter.getMaxSalary()));
        }

        if (dtoFilter.getLevel() != null) {
            predicates.add(cb.equal(root.get("level"), dtoFilter.getLevel()));
        }

        if (dtoFilter.getCompanyId() != null) {
            Join<Job, Company> companyJoin = root.join("company");
            predicates.add(cb.equal(companyJoin.get("id"), dtoFilter.getCompanyId()));
        }

        if (dtoFilter.getSkillId() != null) {
            Join<Job, JobSkill> jobSkillJoin = root.join("jobSkills", JoinType.LEFT);
            predicates.add(cb.equal(jobSkillJoin.get("skill").get("id"), dtoFilter.getSkillId()));
        }

        return cb.and(predicates.toArray(new Predicate[0]));
    }
}
