package vn.phantruongan.backend.config.jwt;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nimbusds.jose.util.Base64;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authentication.entities.RefreshToken;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.RefreshTokenRepository;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.util.error.RefreshTokenException;

@Service
@RequiredArgsConstructor
public class JwtService {

    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS512;
    private final JwtEncoder jwtEncoder;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    @Value("${jwt.base64-secret}")
    private String jwtKey;

    @Value("${jwt.access-token-validity-in-seconds}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    private SecretKey getSecretKey() {
        byte[] keyBytes = Base64.from(jwtKey).decode();
        return new SecretKeySpec(keyBytes, 0, keyBytes.length, JWT_ALGORITHM.getName());
    }

    // Check valid refresh token
    @Transactional
    public String validateRefreshTokenAndGetEmail(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RefreshTokenException("Invalid or missing refresh token"));

        if (refreshToken.getExpiresAt().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new RefreshTokenException("Refresh token has expired");
        }

        // Kiểm tra tokenVersion
        User user = userRepository.findByEmail(refreshToken.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Nếu có tokenVersion
        if (!refreshToken.getTokenVersion().equals(user.getTokenVersion())) {
            throw new RefreshTokenException("Refresh token has expired");
        }

        // Rotation: xóa token cũ
        refreshTokenRepository.delete(refreshToken);

        return refreshToken.getEmail();
    }

    // Create access-token
    public String createAccessToken(String email, long roleId) {
        Instant now = Instant.now();
        Instant validity = now.plus(accessTokenExpiration, ChronoUnit.SECONDS);

        // @formatter:off
        JwtClaimsSet claims = JwtClaimsSet.builder()
        .issuedAt(now)
        .expiresAt(validity)
        .subject(email)
        .claim("roleId", roleId)
        .build();
        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader,
       claims)).getTokenValue();
    }
    
    // Create refresh-token
    @Transactional
    public String createRefreshToken(String email) {
        // Xóa token cũ của user này (rotation + single session)
        refreshTokenRepository.deleteAllByEmail(email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String token = UUID.randomUUID().toString() + "-" + System.nanoTime();

        RefreshToken entity = RefreshToken.builder()
                .token(token)
                .email(email)
                .expiresAt(Instant.now().plusSeconds(refreshTokenExpiration))
                .createdAt(Instant.now())
                .tokenVersion(user.getTokenVersion() != null ? user.getTokenVersion() : 0L)
                .build();

        refreshTokenRepository.save(entity);
        return token;
    }


    public static Optional<String> getCurrentUserLogin() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(extractPrincipal(securityContext.getAuthentication()));
    }

    private static String extractPrincipal(Authentication authentication) {
        if (authentication == null) {
            return null;
        } else if (authentication.getPrincipal() instanceof UserDetails springSecurityUser) {
            return springSecurityUser.getUsername();
        } else if (authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getSubject();
        } else if (authentication.getPrincipal() instanceof String s) {
            return s;
        }
        return null;
    }


}
