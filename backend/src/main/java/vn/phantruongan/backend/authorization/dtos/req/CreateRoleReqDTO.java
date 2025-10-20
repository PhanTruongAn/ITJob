package vn.phantruongan.backend.authorization.dtos.req;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateRoleReqDTO {
    @NotBlank(message = "Role name must not be blank")
    private String name;

    private String description;

    private boolean active;
}
