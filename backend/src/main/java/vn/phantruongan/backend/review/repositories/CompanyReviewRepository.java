package vn.phantruongan.backend.review.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import vn.phantruongan.backend.review.entities.CompanyReview;

@Repository
public interface CompanyReviewRepository extends JpaRepository<CompanyReview, Long> {
    Page<CompanyReview> findAllByCompany_IdAndHiddenFalse(Long companyId, Pageable pageable);

    @Query("""
            SELECT AVG(review.rating) AS averageRating,
                   COUNT(review.id) AS totalReviews,
                   COALESCE(SUM(CASE WHEN review.rating = 1 THEN 1 ELSE 0 END), 0) AS oneStarCount,
                   COALESCE(SUM(CASE WHEN review.rating = 2 THEN 1 ELSE 0 END), 0) AS twoStarCount,
                   COALESCE(SUM(CASE WHEN review.rating = 3 THEN 1 ELSE 0 END), 0) AS threeStarCount,
                   COALESCE(SUM(CASE WHEN review.rating = 4 THEN 1 ELSE 0 END), 0) AS fourStarCount,
                   COALESCE(SUM(CASE WHEN review.rating = 5 THEN 1 ELSE 0 END), 0) AS fiveStarCount
            FROM CompanyReview review
            WHERE review.company.id = :companyId AND review.hidden = false
            """)
    CompanyReviewSummaryProjection getVisibleSummaryByCompanyId(@Param("companyId") Long companyId);

    Optional<CompanyReview> findByIdAndUser_Id(Long id, Long userId);
}
