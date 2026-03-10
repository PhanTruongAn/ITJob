package vn.phantruongan.backend.job.dtos.req.jobSkill;

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

}