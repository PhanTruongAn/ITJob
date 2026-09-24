package vn.phantruongan.backend.job.dtos.res;

import java.time.Instant;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;
import vn.phantruongan.backend.job.enums.JobTypeEnum;
import vn.phantruongan.backend.job.enums.LevelEnum;

@Data
@NoArgsConstructor
public class JobResDTO {
    private long id;
    private String name;
    private String location;
    private String description;
    private int quantity;
    private Double salary;
    private LevelEnum level;
    private JobTypeEnum jobType;
    private Instant startDate;
    private Instant endDate;
    private boolean active;
    private Long companyId;
    private String companyName;
    private String companyLogo;
    private List<JobSkillResDTO> jobSkills;
}
