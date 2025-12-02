package vn.phantruongan.backend.profile.dtos.req;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordReqDTO {
    @NotBlank(message = "Old password must not be blank")
    private String oldPassword;
    @NotBlank(message = "New password must not be blank")
    private String newPassword;
}
