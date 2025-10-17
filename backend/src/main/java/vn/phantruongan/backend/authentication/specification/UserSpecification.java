package vn.phantruongan.backend.authentication.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import vn.phantruongan.backend.authentication.dtos.req.GetListUserReqDTO;
import vn.phantruongan.backend.authentication.entities.User;

public class UserSpecification implements Specification<User> {
    private final GetListUserReqDTO dtoFilter;

    public UserSpecification(GetListUserReqDTO dtoFilter) {
        this.dtoFilter = dtoFilter;
    }

    @Override
    @Nullable
    public Predicate toPredicate(Root<User> root, @Nullable CriteriaQuery<?> query, CriteriaBuilder cb) {
        // TODO Auto-generated method stub
        List<Predicate> predicates = new ArrayList<>();

        if (dtoFilter.getName() != null) {
            predicates.add(cb.like(cb.lower(root.get("name")), "%" + dtoFilter.getName().toLowerCase() + "%"));
        }
        if (dtoFilter.getPhone() != null) {
            predicates.add(cb.like(cb.lower(root.get("phone")), dtoFilter.getPhone().toLowerCase() + "%"));
        }

        if (dtoFilter.getEmail() != null) {
            predicates.add(cb.like(cb.lower(root.get("email")), dtoFilter.getPhone().toLowerCase() + "%"));
        }

        if (dtoFilter.getGender() != null) {
            predicates.add(cb.equal(root.get("gender"), dtoFilter.getGender()));
        }

        return cb.and(predicates.toArray(new Predicate[0]));
    }

}
