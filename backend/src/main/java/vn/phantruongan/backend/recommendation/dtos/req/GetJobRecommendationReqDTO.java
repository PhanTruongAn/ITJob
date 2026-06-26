package vn.phantruongan.backend.recommendation.dtos.req;

import java.time.Instant;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.phantruongan.backend.recommendation.enums.RecommendationStatus;

@Getter
@Setter
@NoArgsConstructor
public class GetJobRecommendationReqDTO {
    private Long subscriberId;
    private Long companyId;
    private RecommendationStatus status;
    private String keyword; // search by subscriber email, job title, company name
    private Instant fromDate;
    private Instant toDate;
    private Double minMatch;
}
