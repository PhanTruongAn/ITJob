package vn.phantruongan.backend.specification.user;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import vn.phantruongan.backend.domain.User;
import vn.phantruongan.backend.dto.filter.user.UserFilter;

public class UserSpecification implements Specification<User> {
    private final UserFilter filter;

    public UserSpecification(UserFilter filter) {
        this.filter = filter;
    }

    @Override
    @Nullable
    public Predicate toPredicate(Root<User> root, @Nullable CriteriaQuery<?> query, CriteriaBuilder cb) {
        // TODO Auto-generated method stub
        List<Predicate> predicates = new ArrayList<>();

        if (filter.getName() != null) {
            predicates.add(cb.like(cb.lower(root.get("name")), "%" + filter.getName().toLowerCase() + "%"));
        }
        if (filter.getPhone() != null) {
            predicates.add(cb.like(cb.lower(root.get("phone")), filter.getPhone().toLowerCase() + "%"));
        }
        return cb.and(predicates.toArray(new Predicate[0]));
    }

}
