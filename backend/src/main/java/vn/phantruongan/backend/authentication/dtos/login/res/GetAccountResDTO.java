package vn.phantruongan.backend.authentication.dtos.login.res;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class GetAccountResDTO {
    private long id;
    private String email;
    private String name;
    private String avatar;
}