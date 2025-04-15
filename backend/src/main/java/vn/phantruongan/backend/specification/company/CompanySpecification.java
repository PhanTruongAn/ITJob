package vn.phantruongan.backend.specification.company;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.util.Predicates;
import org.springframework.lang.Nullable;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import vn.phantruongan.backend.domain.Company;
import vn.phantruongan.backend.dto.filter.company.CompanyFilter;

public class CompanySpecification implements Specification<Company> {
    private final CompanyFilter filter;

    public CompanySpecification(CompanyFilter filter) {
        this.filter = filter;
    }

    @Override
    @Nullable
    public Predicate toPredicate(Root<Company> root, @Nullable CriteriaQuery<?> query,
            CriteriaBuilder cb) {

        List<Predicate> predicates = new ArrayList<>();

        if (filter.getName() != null) {
            predicates.add(cb.like(cb.lower(root.get("name")), "%" + filter.getName().toLowerCase() + "%"));
        }
        return cb.and(predicates.toArray(new Predicate[0]));
    }

}
