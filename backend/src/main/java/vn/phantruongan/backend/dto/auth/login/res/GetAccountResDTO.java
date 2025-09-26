package vn.phantruongan.backend.dto.auth.login.res;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetAccountResDTO {
    private long id;
    private String email;
    private String name;
    private String avatar;
}