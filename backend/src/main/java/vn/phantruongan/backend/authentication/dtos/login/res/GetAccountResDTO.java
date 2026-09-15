package vn.phantruongan.backend.authentication.dtos.login.res;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
public class GetAccountResDTO {
    private long id;
    private String email;
    private String name;
    private String avatar;
    private RoleDTO role;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RoleDTO {
        private long id;
        private String name;
    }
}