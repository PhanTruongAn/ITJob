package vn.phantruongan.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.phantruongan.backend.domain.User;
import vn.phantruongan.backend.dto.LoginDTO;
import vn.phantruongan.backend.dto.ResLoginDTO;
import vn.phantruongan.backend.service.UserService;
import vn.phantruongan.backend.util.SecurityUtil;

@RestController
public class AuthController {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtil securityService;
    private final UserService userService;

    @Value("${jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    public AuthController(AuthenticationManagerBuilder authenticationManagerBuilder, SecurityUtil securityService,
            UserService userService) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityService = securityService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody LoginDTO loginDto) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginDto.getUsername(), loginDto.getPassword());

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        // Create access token
        String access_token = securityService.createAccessToken(authentication);
        ResLoginDTO res = new ResLoginDTO();
        User userInDB = userService.findUserByEmail(loginDto.getUsername());
        if (userInDB != null) {
            ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin();
            userLogin.setId(userInDB.getId());
            userLogin.setEmail(userInDB.getEmail());
            userLogin.setName(userInDB.getName());
            res.setAccessToken(access_token);
            res.setUser(userLogin);
        }
        // Create refresh token
        String refresh_token = securityService.createRefreshToken(loginDto.getUsername(), res);
        userService.updateRefreshToken(loginDto.getUsername(), refresh_token);

        // Set refresh token in cookies
        ResponseCookie cookies = ResponseCookie.from("refresh_token", refresh_token)
                .httpOnly(true)
                .secure(true)
                .maxAge(refreshTokenExpiration)
                .build();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookies.toString()).body(res);
    }
}
