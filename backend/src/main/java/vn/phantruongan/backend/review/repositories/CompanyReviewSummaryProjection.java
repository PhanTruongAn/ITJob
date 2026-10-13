package vn.phantruongan.backend.review.repositories;

public interface CompanyReviewSummaryProjection {
    Double getAverageRating();

    Long getTotalReviews();

    Long getOneStarCount();

    Long getTwoStarCount();

    Long getThreeStarCount();

    Long getFourStarCount();

    Long getFiveStarCount();
}
