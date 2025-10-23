package vn.phantruongan.backend.authorization.dtos.req.role;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GetListRoleReqDTO {
    private String name;
    private Boolean active;
}
