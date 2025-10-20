package vn.phantruongan.backend.authorization.dtos.res;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RoleResDTO {
    private long id;
    private String name;
    private String description;
    private boolean active;
}
