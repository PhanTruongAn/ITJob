package vn.phantruongan.backend.recommendation.dtos.res;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.phantruongan.backend.recommendation.enums.RecommendationStatus;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobRecommendationResDTO {
    private Long id;
    private String jobTitle;
    private String subscriberEmail;
    private RecommendationStatus status;
    private Instant createdAt;
}
