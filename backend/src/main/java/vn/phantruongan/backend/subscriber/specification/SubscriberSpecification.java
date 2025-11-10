package vn.phantruongan.backend.subscriber.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import vn.phantruongan.backend.subscriber.dtos.req.subscriber.GetListSubscriberReqDTO;
import vn.phantruongan.backend.subscriber.entities.Subscriber;

public class SubscriberSpecification implements Specification<Subscriber> {

    private final GetListSubscriberReqDTO dtoFilter;

    public SubscriberSpecification(GetListSubscriberReqDTO dtoFilter) {
        this.dtoFilter = dtoFilter;
    }

    @Override
    @Nullable
    public Predicate toPredicate(Root<Subscriber> root, @Nullable CriteriaQuery<?> query,
            CriteriaBuilder cb) {
        List<Predicate> predicates = new ArrayList<>();
        if (dtoFilter.getEmail() != null && !dtoFilter.getEmail().isBlank()) {
            predicates.add(cb.like(cb.lower(root.get("email")), "%" + dtoFilter.getEmail().toLowerCase().trim() + "%"));
        }
        return cb.and(predicates.toArray(new Predicate[0]));
    }
}
