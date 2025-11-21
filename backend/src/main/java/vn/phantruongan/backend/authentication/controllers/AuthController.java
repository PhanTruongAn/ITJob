package vn.phantruongan.backend.authentication.controllers;

import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authentication.dtos.google.req.GoogleLoginReqDTO;
import vn.phantruongan.backend.authentication.dtos.login.req.LoginDTO;
import vn.phantruongan.backend.authentication.dtos.login.res.GetAccountResDTO;
import vn.phantruongan.backend.authentication.dtos.login.res.ResLoginDTO;
import vn.phantruongan.backend.authentication.dtos.register.RegisterReqDTO;
import vn.phantruongan.backend.authentication.dtos.register.RegisterResDTO;
import vn.phantruongan.backend.authentication.services.AuthService;
import vn.phantruongan.backend.config.jwt.JwtService;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.error.InvalidException;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Auth Controller", description = "Quản lý xác thực")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/auth/google")
    @ApiMessage("Login with Google")
    public ResponseEntity<ResLoginDTO> loginWithGoogle(@Valid @RequestBody GoogleLoginReqDTO request)
            throws Exception {
        ResLoginDTO res = authService.googleLogin(request);
        return authService.buildLoginResponse(res);
    }

    @PostMapping("/auth/login")
    @ApiMessage("Login")
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody LoginDTO loginDto) {
        ResLoginDTO res = authService.normalLogin(loginDto);
        return authService.buildLoginResponse(res);
    }

    @PostMapping("/auth/refresh")
    @ApiMessage("Refresh token")
    public ResponseEntity<ResLoginDTO> refreshToken(
            @CookieValue(name = "refresh_token", required = false) String refreshToken) {

        if (refreshToken == null || refreshToken.isBlank()) {
            throw new InvalidException("Refresh token not found in cookies");
        }

        ResLoginDTO res = authService.refreshToken(refreshToken);
        return authService.buildLoginResponse(res);
    }

    @GetMapping("/auth/account")
    @ApiMessage("Get account information")
    public ResponseEntity<GetAccountResDTO> getAccount() {
        String email = JwtService.getCurrentUserLogin()
                .orElseThrow(() -> new InvalidException("Unauthenticated user"));

        GetAccountResDTO dto = authService.getCurrentUserAccount(email); // đề xuất chuyển logic sang service cho sạch

        return ResponseEntity.ok(dto);
    }

    @PostMapping("/auth/register")
    @ApiMessage("Register new user")
    public ResponseEntity<RegisterResDTO> register(@Valid @RequestBody RegisterReqDTO dto)
            throws BadRequestException {

        RegisterResDTO res = authService.register(dto);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/auth/logout")
    @ApiMessage("Logout")
    public ResponseEntity<Void> logout() {
        String email = JwtService.getCurrentUserLogin()
                .orElseThrow(() -> new InvalidException("Unauthenticated user"));

        authService.logout(email);

        ResponseCookie deleteCookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .build();
    }
}