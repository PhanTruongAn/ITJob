package vn.phantruongan.backend.authorization.dtos.req.permission;

import jakarta.validation.constraints.NotBlank;
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

    @NotBlank(message = "Method must not be blank!")
    private MethodEnum method;

    @NotBlank(message = "Action must not be blank!")
    private ActionEnum action;

    @NotBlank(message = "Resource must not be blank!")
    private ResourceEnum resource;

}
