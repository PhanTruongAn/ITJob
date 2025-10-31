package vn.phantruongan.backend.subscriber.dtos.req.skill;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSkillReqDTO {
    @NotBlank(message = "Skill name must not be blank!")
    private String name;
}
