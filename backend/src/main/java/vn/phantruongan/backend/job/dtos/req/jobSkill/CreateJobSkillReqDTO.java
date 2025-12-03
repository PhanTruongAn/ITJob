package vn.phantruongan.backend.job.dtos.req.jobSkill;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateJobSkillReqDTO {

    @NotNull(message = "Skill ID must not be null")
    private Long skillId;

    private boolean required;

    @Min(value = 1, message = "Priority must be greater than or equal to 1")
    private int priority;

}