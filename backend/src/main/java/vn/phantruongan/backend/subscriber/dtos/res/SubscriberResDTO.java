package vn.phantruongan.backend.subscriber.dtos.res;

import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SubscriberResDTO {
    private Long id;
    private String email;
    private List<SkillResDTO> skills;
}
