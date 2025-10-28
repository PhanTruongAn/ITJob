package vn.phantruongan.backend.authorization.dtos.req.permission;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.MethodEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePermissionReqDTO {

    @NotBlank(message = "Permission name must not be blank!")
    private String name;

    private String apiPath;

    @NotNull(message = "Method must not be null!")
    private MethodEnum method;

    @NotNull(message = "Action must not be null!")
    private ActionEnum action;

    @NotNull(message = "Resource must not be null!")
    private ResourceEnum resource;

}
