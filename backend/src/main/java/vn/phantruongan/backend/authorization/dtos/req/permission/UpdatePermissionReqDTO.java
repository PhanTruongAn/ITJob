package vn.phantruongan.backend.authorization.dtos.req.permission;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class UpdatePermissionReqDTO extends CreatePermissionReqDTO {
    private Long id;
}
