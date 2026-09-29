package vn.phantruongan.backend.review.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import vn.phantruongan.backend.review.entities.CompanyReview;

@Repository
public interface CompanyReviewRepository extends JpaRepository<CompanyReview, Long> {
    Page<CompanyReview> findAllByCompany_IdAndHiddenFalse(Long companyId, Pageable pageable);

    Optional<CompanyReview> findByIdAndUser_Id(Long id, Long userId);
}
