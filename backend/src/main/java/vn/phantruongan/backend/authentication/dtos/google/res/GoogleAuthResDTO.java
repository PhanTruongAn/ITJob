package vn.phantruongan.backend.authentication.dtos.google.res;

import vn.phantruongan.backend.authentication.dtos.res.UserResDTO;

public class GoogleAuthResDTO {
    private String accessToken;
    private long expiresIn;
    private UserResDTO user;
}
