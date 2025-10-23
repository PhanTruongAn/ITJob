package vn.phantruongan.backend.authorization.dtos.res;

import lombok.Data;
import lombok.NoArgsConstructor;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.MethodEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;

@Data
@NoArgsConstructor
public class PermissionResDTO {
    private long id;
    private String name;
    private String apiPath;
    private MethodEnum method;
    private ActionEnum action;
    private ResourceEnum resource;
}
