package vn.phantruongan.backend.job.dtos.req.job;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class UpdateJobReqDTO extends CreateJobReqDTO {
    private Long id;
}
