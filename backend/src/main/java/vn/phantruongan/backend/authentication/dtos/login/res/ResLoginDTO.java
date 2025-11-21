package vn.phantruongan.backend.authentication.dtos.login.res;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResLoginDTO {
    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("refresh_token")
    private String refreshToken;

    @JsonIgnore
    private String refreshTokenTemp;

    private UserInfo user;

    @Getter
    @Setter
    public static class UserInfo {
        private Long id;
        private String email;
        private String name;
        private String avatar;

    }
}
