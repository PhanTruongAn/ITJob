package vn.phantruongan.backend.subscriber.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import vn.phantruongan.backend.subscriber.dtos.req.skill.GetListSkillReqDTO;
import vn.phantruongan.backend.subscriber.entities.Skill;

public class SkillSpecification implements Specification<Skill> {

    private final GetListSkillReqDTO dtoFilter;

    public SkillSpecification(GetListSkillReqDTO dtoFilter) {
        this.dtoFilter = dtoFilter;
    }

    @Override
    @Nullable
    public Predicate toPredicate(Root<Skill> root, @Nullable CriteriaQuery<?> query, CriteriaBuilder cb) {
        List<Predicate> predicates = new ArrayList<>();
        if (dtoFilter.getName() != null && !dtoFilter.getName().isBlank()) {
            predicates.add(cb.like(cb.lower(root.get("name")), "%" + dtoFilter.getName().toLowerCase().trim() + "%"));
        }
        return cb.and(predicates.toArray(new Predicate[0]));
    }
}
