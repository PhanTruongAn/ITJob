package vn.phantruongan.backend.job.dtos.res;

import lombok.Data;
import lombok.NoArgsConstructor;
import vn.phantruongan.backend.subscriber.dtos.res.SkillResDTO;

@Data
@NoArgsConstructor
public class JobSkillResDTO {
    private Long id;
    private boolean required;
    private int priority;
    private SkillResDTO skill;
}
