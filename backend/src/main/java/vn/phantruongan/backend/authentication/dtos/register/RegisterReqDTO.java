package vn.phantruongan.backend.authentication.dtos.register;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterReqDTO {
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String name;

    private String avatar;
}
