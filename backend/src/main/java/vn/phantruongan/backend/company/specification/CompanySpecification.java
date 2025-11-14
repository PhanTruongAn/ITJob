package vn.phantruongan.backend.company.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import vn.phantruongan.backend.company.dtos.req.GetListCompanyReqDTO;
import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.company.entities.Country;

public class CompanySpecification implements Specification<Company> {
    private final GetListCompanyReqDTO dtoFilter;

    public CompanySpecification(GetListCompanyReqDTO dtoFilter) {
        this.dtoFilter = dtoFilter;
    }

    @Override
    @Nullable
    public Predicate toPredicate(Root<Company> root, @Nullable CriteriaQuery<?> query,
            CriteriaBuilder cb) {

        List<Predicate> predicates = new ArrayList<>();

        if (dtoFilter.getName() != null) {
            predicates.add(cb.like(cb.lower(root.get("name")), "%" + dtoFilter.getName().toLowerCase() + "%"));
        }

        if (dtoFilter.getAddress() != null) {
            predicates.add(cb.like(cb.lower(root.get("address")), "%" + dtoFilter.getAddress().toLowerCase() + "%"));
        }

        if (dtoFilter.getCompanySize() != null) {
            predicates.add(cb.equal(root.get("companySize"), dtoFilter.getCompanySize()));
        }

        if (dtoFilter.getCompanyType() != null) {
            predicates.add(cb.equal(root.get("companyType"), dtoFilter.getCompanyType()));
        }

        if (dtoFilter.getStatus() != null) {
            predicates.add(cb.equal(root.get("status"), dtoFilter.getStatus()));
        }

        if (dtoFilter.getCountryId() != null) {
            Join<Company, Country> countryJoin = root.join("country");
            predicates.add(cb.equal(countryJoin.get("id"), dtoFilter.getCountryId()));
        }
        return cb.and(predicates.toArray(new Predicate[0]));
    }

}
