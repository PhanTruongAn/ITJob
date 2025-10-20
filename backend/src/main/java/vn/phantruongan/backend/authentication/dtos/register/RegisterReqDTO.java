package vn.phantruongan.backend.authentication.dtos.register;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterReqDTO {
    @NotBlank(message = "Email must not be empty.")
    private String email;

    @NotBlank(message = "Password must not be empty.")
    private String password;

    @NotBlank(message = "Name must not be empty.")
    private String name;

    private String avatar;
}
