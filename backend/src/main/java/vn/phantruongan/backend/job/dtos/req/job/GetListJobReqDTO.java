package vn.phantruongan.backend.job.dtos.req.job;

import lombok.Data;
import lombok.NoArgsConstructor;
import vn.phantruongan.backend.job.enums.LevelEnum;

@Data
@NoArgsConstructor
public class GetListJobReqDTO {

    private String name;
    private String location;
    private Double minSalary;
    private Double maxSalary;
    private LevelEnum level;
    private Long companyId;
    private Long skillId;
}
