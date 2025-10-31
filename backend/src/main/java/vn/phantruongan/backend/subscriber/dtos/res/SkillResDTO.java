package vn.phantruongan.backend.subscriber.dtos.res;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SkillResDTO {
    private Long id;
    private String name;
    private String description;
}
