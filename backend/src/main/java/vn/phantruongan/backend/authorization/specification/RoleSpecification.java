package vn.phantruongan.backend.authorization.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import vn.phantruongan.backend.authorization.dtos.req.GetListRoleReqDTO;
import vn.phantruongan.backend.authorization.entities.Role;

public class RoleSpecification implements Specification<Role> {
    private final GetListRoleReqDTO dtoFilter;

    public RoleSpecification(GetListRoleReqDTO dtoFilter) {
        this.dtoFilter = dtoFilter;
    }

    @Override
    @Nullable
    public Predicate toPredicate(Root<Role> root, @Nullable CriteriaQuery<?> query, CriteriaBuilder cb) {

        List<Predicate> predicates = new ArrayList<>();

        if (dtoFilter.getName() != null) {
            predicates.add(cb.like(cb.lower(root.get("name")), "%" + dtoFilter.getName().toLowerCase() + "%"));
        }

        if (dtoFilter.getActive() != null) {
            predicates.add(cb.equal(root.get("active"), dtoFilter.getActive()));
        }

        return cb.and(predicates.toArray(new Predicate[0]));
    }
}
