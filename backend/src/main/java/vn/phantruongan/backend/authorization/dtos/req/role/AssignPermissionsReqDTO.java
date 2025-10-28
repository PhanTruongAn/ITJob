package vn.phantruongan.backend.authorization.dtos.req.role;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignPermissionsReqDTO {
    private Long roleId;
    private List<Long> permissionIds;
}
