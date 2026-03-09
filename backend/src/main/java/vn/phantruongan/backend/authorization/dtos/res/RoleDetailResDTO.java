package vn.phantruongan.backend.authorization.dtos.res;

import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class RoleDetailResDTO extends RoleResDTO {
    private List<PermissionResDTO> permissions;
}
