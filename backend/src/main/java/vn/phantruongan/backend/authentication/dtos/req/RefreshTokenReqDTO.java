package vn.phantruongan.backend.authentication.dtos.req;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefreshTokenReqDTO {
    private String refreshToken;
}
