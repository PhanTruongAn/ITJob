package vn.phantruongan.backend.recommendation.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.recommendation.entities.JobRecommendation;

@Repository
public interface JobRecommendationRepository extends JpaRepository<JobRecommendation, Long> {
    Page<JobRecommendation> findAllBySubscriberId(Long subscriberId, Pageable pageable);

    public boolean existsBySubscriber_IdAndJob_Id(Long subscriberId, Long jobId);

    long countBySubscriber_IdAndStatus(Long subscriberId, vn.phantruongan.backend.recommendation.enums.RecommendationStatus status);
}
