package vn.phantruongan.backend.authentication.dtos.req;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefreshTokenReqDTO {

    @NotBlank(message = "Refresh token in body cannot be blank")
    private String refreshToken;
}
