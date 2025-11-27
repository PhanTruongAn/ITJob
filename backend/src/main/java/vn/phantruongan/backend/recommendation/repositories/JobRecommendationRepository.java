package vn.phantruongan.backend.recommendation.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.recommendation.entities.JobRecommendation;

@Repository
public interface JobRecommendationRepository extends JpaRepository<JobRecommendation, Long> {

}
