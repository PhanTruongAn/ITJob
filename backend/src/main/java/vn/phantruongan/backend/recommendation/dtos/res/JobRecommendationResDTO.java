package vn.phantruongan.backend.recommendation.dtos.res;

import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.phantruongan.backend.recommendation.enums.EmailStatus;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobRecommendationResDTO {
    private Long id;

    // Subscriber info
    private Long subscriberId;
    private String subscriberEmail;

    // Company info
    private Long companyId;
    private String companyName;

    // Job info
    private Long jobId;
    private String jobTitle;

    // Match info
    private Double matchScore;
    private List<String> matchedSkills;
    private String reason;

    // Status
    private EmailStatus emailStatus;
    private Instant sentAt;

    // Audit
    private Instant createdAt;
}
