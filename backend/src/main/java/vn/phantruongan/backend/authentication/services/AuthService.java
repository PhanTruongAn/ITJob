package vn.phantruongan.backend.authentication.services;

import java.io.IOException;
import java.security.GeneralSecurityException;

import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authentication.dtos.google.req.GoogleLoginReqDTO;
import vn.phantruongan.backend.authentication.dtos.google.res.GoogleTokenInfoResDTO;
import vn.phantruongan.backend.authentication.dtos.login.req.LoginDTO;
import vn.phantruongan.backend.authentication.dtos.login.res.GetAccountResDTO;
import vn.phantruongan.backend.authentication.dtos.login.res.ResLoginDTO;
import vn.phantruongan.backend.authentication.dtos.register.RegisterReqDTO;
import vn.phantruongan.backend.authentication.dtos.register.RegisterResDTO;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.RefreshTokenRepository;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.authorization.entities.Role;
import vn.phantruongan.backend.authorization.repositories.RoleRepository;
import vn.phantruongan.backend.config.jwt.JwtService;
import vn.phantruongan.backend.extenals.google.GoogleAuthService;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final GoogleAuthService googleAuthService;
    private final JwtService jwtService;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    private static final long REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60L;

    public RegisterResDTO register(RegisterReqDTO dto) throws BadRequestException {
        if (userRepository.findByEmail(dto.getEmail()) != null) {
            throw new BadRequestException("Email already in use!");
        }

        User user = User.builder()
                .email(dto.getEmail())
                .name(dto.getName())
                .avatar(dto.getAvatar())
                .password(passwordEncoder.encode(dto.getPassword()))
                .build();

        User savedUser = userRepository.save(user);

        // map sang response
        RegisterResDTO res = new RegisterResDTO();
        res.setId(savedUser.getId());
        res.setEmail(savedUser.getEmail());
        res.setName(savedUser.getName());
        res.setAvatar(savedUser.getAvatar());
        return res;
    }

    private ResLoginDTO loginCommon(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String accessToken = jwtService.createAccessToken(email, user.getRole().getId());
        String refreshToken = jwtService.createRefreshToken(email); // opaque + lưu DB

        ResLoginDTO res = new ResLoginDTO();
        ResLoginDTO.UserInfo userInfo = new ResLoginDTO.UserInfo();
        userInfo.setId(user.getId());
        userInfo.setEmail(user.getEmail());
        userInfo.setName(user.getName());
        userInfo.setAvatar(user.getAvatar());
        res.setUser(userInfo);
        res.setAccessToken(accessToken);
        // refreshToken KHÔNG bỏ vào body -> chỉ set cookie ở controller
        res.setRefreshTokenTemp(refreshToken);
        return res;
    }

    public ResLoginDTO normalLogin(LoginDTO loginDto) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginDto.getUsername(), loginDto.getPassword());

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return loginCommon(loginDto.getUsername());
    }

    public ResLoginDTO googleLogin(GoogleLoginReqDTO req) throws GeneralSecurityException, IOException {
        GoogleTokenInfoResDTO info = googleAuthService.verify(req.getIdToken());

        User user = userRepository.findByGoogleId(info.getSub())
                .orElseGet(() -> createOrUpdateGoogleUser(info));

        return loginCommon(user.getEmail());
    }

    // Nếu user chưa tồn tại -> tạo mới, nếu đã có thì update avatar/name
    private User createOrUpdateGoogleUser(GoogleTokenInfoResDTO info) {
        Role candidateRole = roleRepository.findByName("CANDIDATE")
                .orElseThrow(() -> new IllegalArgumentException("Role CANDIDATE not found"));

        User user = userRepository.findByEmail(info.getEmail())
                .orElseGet(() -> User.builder()
                        .email(info.getEmail())
                        .role(candidateRole)
                        .build());

        user.setGoogleId(info.getSub());
        user.setName(info.getName());
        user.setAvatar(info.getPicture());

        return userRepository.save(user);
    }

    public ResponseEntity<ResLoginDTO> buildLoginResponse(ResLoginDTO dto) {
        String refreshToken = dto.getRefreshTokenTemp();

        ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(REFRESH_TOKEN_EXPIRATION)
                .sameSite("None")
                .build();

        // Xóa field tạm khỏi JSON response
        dto.setRefreshTokenTemp(null);
        dto.setRefreshToken(refreshToken);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(dto);
    }

    public ResLoginDTO refreshToken(String refreshTokenValue) {
        // 1. Validate + lấy email (cũ sẽ bị rotation xóa luôn)
        String email = jwtService.validateRefreshTokenAndGetEmail(refreshTokenValue);

        // 2. Tạo access token mới
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String newAccessToken = jwtService.createAccessToken(email, user.getRole().getId());

        // 3. Tạo refresh token mới (rotation đã xảy ra trong validate rồi)
        String newRefreshToken = jwtService.createRefreshToken(email);

        ResLoginDTO res = new ResLoginDTO();
        res.setAccessToken(newAccessToken);
        res.setRefreshTokenTemp(newRefreshToken);

        return res;
    }

    public void logout(String email) {
        refreshTokenRepository.deleteAllByEmail(email);

        // Optional: logout tất cả thiết bị (nếu có tokenVersion)
        userRepository.findByEmail(email).ifPresent(user -> {
            user.setTokenVersion(user.getTokenVersion() + 1);
            userRepository.save(user);
        });
    }

    public GetAccountResDTO getCurrentUserAccount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return GetAccountResDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .avatar(user.getAvatar())
                .build();
    }
}
