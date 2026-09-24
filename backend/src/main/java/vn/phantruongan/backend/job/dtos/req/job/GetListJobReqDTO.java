package vn.phantruongan.backend.job.dtos.req.job;

import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;
import vn.phantruongan.backend.job.enums.JobTypeEnum;
import vn.phantruongan.backend.job.enums.LevelEnum;

@Data
@NoArgsConstructor
public class GetListJobReqDTO {

    private String name;
    private String location;
    private Double minSalary;
    private Double maxSalary;
    private LevelEnum level;
    private List<LevelEnum> levels;
    private JobTypeEnum jobType;
    private List<JobTypeEnum> jobTypes;
    private Long companyId;
    private Long skillId;
    private List<Long> skillIds;
    private String sortBy; // newest | salary_desc | salary_asc
}

