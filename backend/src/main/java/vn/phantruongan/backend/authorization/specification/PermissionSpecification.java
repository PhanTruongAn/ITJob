package vn.phantruongan.backend.authorization.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import vn.phantruongan.backend.authorization.dtos.req.permission.GetListPermissionReqDTO;
import vn.phantruongan.backend.authorization.entities.Permission;

public class PermissionSpecification implements Specification<Permission> {
    private final GetListPermissionReqDTO dtoFilter;

    public PermissionSpecification(GetListPermissionReqDTO dtoFilter) {
        this.dtoFilter = dtoFilter;
    }

    @Override
    @Nullable
    public Predicate toPredicate(Root<Permission> root, @Nullable CriteriaQuery<?> query, CriteriaBuilder cb) {

        List<Predicate> predicates = new ArrayList<>();

        if (dtoFilter.getName() != null) {
            predicates.add(cb.like(cb.lower(root.get("name")), "%" + dtoFilter.getName().toLowerCase() + "%"));
        }

        if (dtoFilter.getMethod() != null) {
            predicates.add(cb.equal(root.get("method"), dtoFilter.getMethod()));
        }

        if (dtoFilter.getAction() != null) {
            predicates.add(cb.equal(root.get("action"), dtoFilter.getAction()));
        }

        if (dtoFilter.getResource() != null) {
            predicates.add(cb.equal(root.get("resource"), dtoFilter.getResource()));
        }
        return cb.and(predicates.toArray(new Predicate[0]));
    }
}
