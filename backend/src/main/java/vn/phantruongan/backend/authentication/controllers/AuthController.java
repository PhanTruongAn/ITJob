package vn.phantruongan.backend.authentication.controllers;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authentication.dtos.login.req.LoginDTO;
import vn.phantruongan.backend.authentication.dtos.login.res.GetAccountResDTO;
import vn.phantruongan.backend.authentication.dtos.login.res.ResLoginDTO;
import vn.phantruongan.backend.authentication.dtos.register.RegisterReqDTO;
import vn.phantruongan.backend.authentication.dtos.register.RegisterResDTO;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.services.AuthService;
import vn.phantruongan.backend.authentication.services.UserService;
import vn.phantruongan.backend.config.jwt.JwtService;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.error.InvalidException;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Auth Controller", description = "Quản lý xác thực")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtService jwtService;
    private final AuthService authService;
    private final UserService userService;

    @Value("${jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    @PostMapping("/auth/login")
    @ApiMessage("Login")
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody LoginDTO loginDto) {

        User user = userService.findUserByEmail(loginDto.getUsername());
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        if (user.getRole() == null) {
            throw new InvalidException("User has no role assigned");
        }

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginDto.getUsername(), loginDto.getPassword());

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        System.err.println(">>> User " + authentication.getAuthorities());
        ResLoginDTO res = new ResLoginDTO();

        // Truyền roleId vào JWT
        String access_token = jwtService.createAccessToken(user.getEmail(), user.getRole().getId());
        res.setAccessToken(access_token);

        String refresh_token = jwtService.createRefreshToken(loginDto.getUsername(), user.getRole().getId(), res);
        userService.updateRefreshToken(loginDto.getUsername(), refresh_token);

        ResponseCookie cookies = ResponseCookie.from("refresh_token", refresh_token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookies.toString())
                .body(res);
    }

    @GetMapping("/auth/account")
    @ApiMessage("Get account information")
    public ResponseEntity<GetAccountResDTO> getAccount() {
        String email = JwtService.getCurrentUserLogin().isPresent()
                ? JwtService.getCurrentUserLogin().get()
                : "";

        User userInDB = userService.findUserByEmail(email);
        GetAccountResDTO userLogin = new GetAccountResDTO();
        if (userInDB != null) {
            userLogin.setId(userInDB.getId());
            userLogin.setEmail(userInDB.getEmail());
            userLogin.setName(userInDB.getName());
            userLogin.setAvatar(userInDB.getAvatar());
        }
        return ResponseEntity.ok().body(userLogin);
    }

    @PostMapping("/auth/register")
    @ApiMessage("Register new user")
    public ResponseEntity<RegisterResDTO> register(@Valid @RequestBody RegisterReqDTO dto) throws BadRequestException {
        RegisterResDTO res = authService.register(dto);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/auth/refresh")
    @ApiMessage("Refresh token")
    public ResponseEntity<ResLoginDTO> getRefreshToken(
            @CookieValue(name = "refresh_token", defaultValue = "none") String refresh_token)
            throws InvalidException {

        if (refresh_token.equals("none")) {
            throw new InvalidException("No refresh token found in cookies.");
        }

        Jwt decodedToken = jwtService.checkRefreshToken(refresh_token);
        String emailUser = decodedToken.getSubject();

        User user = userService.getUserByRefreshTokenAndEmail(refresh_token, emailUser);
        if (user == null) {
            throw new InvalidException("Invalid refresh token.");
        }

        ResLoginDTO res = new ResLoginDTO();
        String access_token = jwtService.createAccessToken(emailUser, user.getRole().getId());
        res.setAccessToken(access_token);

        return ResponseEntity.ok(res);
    }

    @PostMapping("/auth/logout")
    @ApiMessage("Logout")
    public ResponseEntity<Void> logOut() throws InvalidException {
        String email = JwtService.getCurrentUserLogin().isPresent()
                ? JwtService.getCurrentUserLogin().get()
                : "";
        if (email == "") {
            throw new InvalidException("Invalid or unauthenticated user.");
        } else {
            userService.updateRefreshToken(null, email);
            ResponseCookie responseCookie = ResponseCookie
                    .from("refresh_token", null)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(0)
                    .build();
            return ResponseEntity.status(HttpStatus.OK)
                    .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                    .body(null);

        }
    }

}
