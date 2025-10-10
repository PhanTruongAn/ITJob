package vn.phantruongan.backend.authentication.dtos.register;

import lombok.Data;

@Data
public class RegisterResDTO {
    private Long id;
    private String email;
    private String name;
    private String avatar;
}
