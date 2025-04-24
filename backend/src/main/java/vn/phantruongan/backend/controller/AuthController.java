package vn.phantruongan.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.phantruongan.backend.domain.User;
import vn.phantruongan.backend.dto.LoginDTO;
import vn.phantruongan.backend.dto.ResLoginDTO;
import vn.phantruongan.backend.service.UserService;
import vn.phantruongan.backend.util.SecurityUtil;
import vn.phantruongan.backend.util.annotation.ApiMessage;
import vn.phantruongan.backend.util.error.InvalidException;

import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/v1")
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

    @PostMapping("/auth/login")
    @ApiMessage("Login")
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody LoginDTO loginDto) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginDto.getUsername(), loginDto.getPassword());

        // Xác thực người dùng => Cần viết hàm loadUserByUsername
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // Set thông tin người dùng đăng nhập vào context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        ResLoginDTO res = new ResLoginDTO();
        User userInDB = userService.findUserByEmail(loginDto.getUsername());
        if (userInDB != null) {
            ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin();
            userLogin.setId(userInDB.getId());
            userLogin.setEmail(userInDB.getEmail());
            userLogin.setName(userInDB.getName());
            res.setUser(userLogin);
        }
        // Create access token
        String access_token = securityService.createAccessToken(authentication.getName(), res.getUser());
        res.setAccessToken(access_token);
        // Create refresh token
        String refresh_token = securityService.createRefreshToken(loginDto.getUsername(), res);
        userService.updateRefreshToken(loginDto.getUsername(), refresh_token);

        // Set refresh token in cookies
        ResponseCookie cookies = ResponseCookie.from("refresh_token", refresh_token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookies.toString()).body(res);
    }

    @GetMapping("/auth/account")
    @ApiMessage("Get account information")
    public ResponseEntity<ResLoginDTO.UserLogin> getAccount() {
        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        User userInDB = userService.findUserByEmail(email);
        ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin();
        if (userInDB != null) {
            userLogin.setId(userInDB.getId());
            userLogin.setEmail(userInDB.getEmail());
            userLogin.setName(userInDB.getName());

        }
        return ResponseEntity.ok().body(userLogin);
    }

    @GetMapping("/auth/refresh")
    @ApiMessage("Refresh token")
    public ResponseEntity<ResLoginDTO> getRefreshToken(
            @CookieValue(name = "refresh_token", defaultValue = "none") String refresh_token)
            throws InvalidException {

        if (refresh_token.equals("none")) {
            throw new InvalidException("No refresh token found in cookies.");
        }
        // Check valid refresh token
        Jwt decodedToken = securityService.checkRefreshToken(refresh_token);
        String emailUser = decodedToken.getSubject();

        // Check user by refresh token and email
        User user = userService.getUserByRefreshTokenAndEmail(refresh_token, emailUser);
        if (user == null) {
            throw new InvalidException("Invalid refresh token.");
        }
        ResLoginDTO res = new ResLoginDTO();
        User userInDB = userService.findUserByEmail(emailUser);
        if (userInDB != null) {
            ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin();
            userLogin.setId(userInDB.getId());
            userLogin.setEmail(userInDB.getEmail());
            userLogin.setName(userInDB.getName());
            res.setUser(userLogin);
        }
        // Create access token
        String access_token = securityService.createAccessToken(emailUser, res.getUser());
        res.setAccessToken(access_token);
        // Create refresh token
        String new_refresh_token = securityService.createRefreshToken(emailUser, res);
        userService.updateRefreshToken(emailUser, new_refresh_token);

        // Set refresh token in cookies
        ResponseCookie cookies = ResponseCookie.from("refresh_token", new_refresh_token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookies.toString()).body(res);
    }

    @PostMapping("/auth/logout")
    @ApiMessage("Logout")
    public ResponseEntity<Void> logOut() throws InvalidException {
        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
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
