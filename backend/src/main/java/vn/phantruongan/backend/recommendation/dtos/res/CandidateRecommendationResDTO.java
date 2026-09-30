package vn.phantruongan.backend.recommendation.dtos.res;

import java.time.Instant;
import java.util.List;

import lombok.Builder;
import lombok.Getter;
import vn.phantruongan.backend.job.enums.JobTypeEnum;
import vn.phantruongan.backend.job.enums.LevelEnum;

@Getter
@Builder
public class CandidateRecommendationResDTO {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String companyLogo;
    private String location;
    private Double salary;
    private JobTypeEnum jobType;
    private LevelEnum level;
    private Double matchScore;
    private List<String> matchedSkills;
    private Instant createdAt;
}
