package vn.phantruongan.backend.review.dtos.res;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CompanyReviewSummaryResDTO {
    private final Double averageRating;
    private final long totalReviews;
    private final long oneStarCount;
    private final long twoStarCount;
    private final long threeStarCount;
    private final long fourStarCount;
    private final long fiveStarCount;
}
