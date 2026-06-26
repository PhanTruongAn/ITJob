package vn.phantruongan.backend.recommendation.specification;

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
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.recommendation.dtos.req.GetJobRecommendationReqDTO;
import vn.phantruongan.backend.recommendation.entities.JobRecommendation;
import vn.phantruongan.backend.subscriber.entities.Subscriber;

public class JobRecommendationSpecification implements Specification<JobRecommendation> {

    private final GetJobRecommendationReqDTO filter;

    public JobRecommendationSpecification(GetJobRecommendationReqDTO filter) {
        this.filter = filter;
    }

    @Override
    @Nullable
    public Predicate toPredicate(Root<JobRecommendation> root, @Nullable CriteriaQuery<?> query,
            CriteriaBuilder cb) {

        List<Predicate> predicates = new ArrayList<>();

        // Join related entities
        Join<JobRecommendation, Subscriber> subscriberJoin = root.join("subscriber", JoinType.LEFT);
        Join<JobRecommendation, Job> jobJoin = root.join("job", JoinType.LEFT);
        Join<Job, Company> companyJoin = jobJoin.join("company", JoinType.LEFT);

        // Filter by subscriberId
        if (filter.getSubscriberId() != null) {
            predicates.add(cb.equal(subscriberJoin.get("id"), filter.getSubscriberId()));
        }

        // Filter by companyId
        if (filter.getCompanyId() != null) {
            predicates.add(cb.equal(companyJoin.get("id"), filter.getCompanyId()));
        }

        // Filter by status
        if (filter.getStatus() != null) {
            predicates.add(cb.equal(root.get("status"), filter.getStatus()));
        }

        // keyword: search by subscriber email, job title, or company name
        if (filter.getKeyword() != null && !filter.getKeyword().isBlank()) {
            String pattern = "%" + filter.getKeyword().toLowerCase() + "%";
            Predicate emailPredicate = cb.like(cb.lower(subscriberJoin.get("email")), pattern);
            Predicate jobTitlePredicate = cb.like(cb.lower(jobJoin.get("name")), pattern);
            Predicate companyNamePredicate = cb.like(cb.lower(companyJoin.get("name")), pattern);
            predicates.add(cb.or(emailPredicate, jobTitlePredicate, companyNamePredicate));
        }

        // Filter by date range (createdAt)
        if (filter.getFromDate() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), filter.getFromDate()));
        }
        if (filter.getToDate() != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), filter.getToDate()));
        }

        // Filter by minimum match score
        if (filter.getMinMatch() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("matchScore"), filter.getMinMatch()));
        }

        // Avoid duplicate rows due to joins
        if (query != null) {
            query.distinct(true);
        }

        return cb.and(predicates.toArray(new Predicate[0]));
    }
}
