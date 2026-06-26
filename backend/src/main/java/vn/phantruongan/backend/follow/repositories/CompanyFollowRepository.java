package vn.phantruongan.backend.follow.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.follow.entities.CompanyFollow;

@Repository
public interface CompanyFollowRepository extends JpaRepository<CompanyFollow, Long> {

    /**
     * Check if a candidate (by email, matching Subscriber email) follows a company.
     * Used in recommendation scoring to apply companyFollowWeight.
     */
    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END " +
            "FROM CompanyFollow f " +
            "WHERE f.candidate.email = :email AND f.company.id = :companyId AND f.active = true")
    boolean existsBySubscriberEmailAndCompanyId(@Param("email") String email, @Param("companyId") Long companyId);

    /**
     * Get all company IDs that a candidate follows (by email), used for bulk scoring.
     */
    @Query("SELECT f.company.id FROM CompanyFollow f " +
            "WHERE f.candidate.email = :email AND f.active = true")
    List<Long> findFollowedCompanyIdsByEmail(@Param("email") String email);
}
