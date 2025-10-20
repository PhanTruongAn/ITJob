package vn.phantruongan.backend.authorization.dtos.req;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class UpdateRoleReqDTO extends CreateRoleReqDTO {
    @NotNull
    private long id;
}
