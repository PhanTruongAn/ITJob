package vn.phantruongan.backend.review.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.company.repositories.CompanyRepository;
import vn.phantruongan.backend.review.entities.CompanyReview;

@SpringBootTest
@Transactional
class CompanyReviewSummaryIntegrationTest {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CompanyReviewRepository companyReviewRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void companyWithoutVisibleReviewsHasNoAverageAndZeroCounts() {
        Company company = saveCompany();
        entityManager.refresh(company);

        var summary = companyReviewRepository.getVisibleSummaryByCompanyId(company.getId());

        assertNull(company.getRating());
        assertEquals(0, company.getReviews());
        assertNull(summary.getAverageRating());
        assertEquals(0L, summary.getTotalReviews());
        assertEquals(0L, summary.getOneStarCount());
        assertEquals(0L, summary.getTwoStarCount());
        assertEquals(0L, summary.getThreeStarCount());
        assertEquals(0L, summary.getFourStarCount());
        assertEquals(0L, summary.getFiveStarCount());
    }

    @Test
    void visibleAverageAndStarCountsExcludeHiddenReviewsAcrossPages() {
        Company company = saveCompany();
        List.of(1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5)
                .forEach(rating -> saveReview(company, rating, false));
        saveReview(company, 1, true);
        saveReview(company, 5, true);
        companyReviewRepository.flush();
        entityManager.refresh(company);

        var firstPage = companyReviewRepository.findAllByCompany_IdAndHiddenFalse(
                company.getId(), PageRequest.of(0, 10, Sort.by("id")));
        var secondPage = companyReviewRepository.findAllByCompany_IdAndHiddenFalse(
                company.getId(), PageRequest.of(1, 10, Sort.by("id")));
        var summary = companyReviewRepository.getVisibleSummaryByCompanyId(company.getId());

        assertEquals(10, firstPage.getNumberOfElements());
        assertEquals(2, secondPage.getNumberOfElements());
        assertEquals(12, firstPage.getTotalElements());
        assertEquals(12L, summary.getTotalReviews());
        assertEquals(40.0 / 12, summary.getAverageRating(), 0.0001);
        assertEquals(40.0 / 12, company.getRating(), 0.0001);
        assertEquals(12, company.getReviews());
        assertEquals(2L, summary.getOneStarCount());
        assertEquals(2L, summary.getTwoStarCount());
        assertEquals(2L, summary.getThreeStarCount());
        assertEquals(2L, summary.getFourStarCount());
        assertEquals(4L, summary.getFiveStarCount());
    }

    private Company saveCompany() {
        Company company = new Company();
        company.setName("Review summary test " + UUID.randomUUID());
        return companyRepository.saveAndFlush(company);
    }

    private void saveReview(Company company, int rating, boolean hidden) {
        CompanyReview review = new CompanyReview();
        review.setCompany(company);
        review.setRating(rating);
        review.setComment("Integration review");
        review.setHidden(hidden);
        companyReviewRepository.save(review);
    }
}
