package vn.phantruongan.backend.authorization.dtos.req.permission;

import lombok.Data;
import lombok.NoArgsConstructor;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.MethodEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;

@Data
@NoArgsConstructor
public class GetListPermissionReqDTO {
    private String name;
    private MethodEnum method;
    private ActionEnum action;
    private ResourceEnum resource;
}
