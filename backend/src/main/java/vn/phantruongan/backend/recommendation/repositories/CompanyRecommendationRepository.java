package vn.phantruongan.backend.recommendation.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.recommendation.entities.CompanyRecommendation;

@Repository
public interface CompanyRecommendationRepository extends JpaRepository<CompanyRecommendation, Long> {

}
