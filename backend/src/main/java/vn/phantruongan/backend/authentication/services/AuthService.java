package vn.phantruongan.backend.authentication.services;

import java.io.IOException;
import java.security.GeneralSecurityException;

import org.apache.coyote.BadRequestException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authentication.dtos.google.req.GoogleLoginReqDTO;
import vn.phantruongan.backend.authentication.dtos.google.res.GoogleTokenInfoResDTO;
import vn.phantruongan.backend.authentication.dtos.login.res.ResLoginDTO;
import vn.phantruongan.backend.authentication.dtos.register.RegisterReqDTO;
import vn.phantruongan.backend.authentication.dtos.register.RegisterResDTO;
import vn.phantruongan.backend.authentication.entities.User;
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
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final GoogleAuthService googleAuthService;
    private final JwtService jwtService;

    public RegisterResDTO register(RegisterReqDTO dto) throws BadRequestException {
        if (userService.findUserByEmail(dto.getEmail()) != null) {
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

    public ResLoginDTO googleLogin(GoogleLoginReqDTO req) throws GeneralSecurityException, IOException {
        GoogleTokenInfoResDTO info = googleAuthService.verify(req.getIdToken());

        User user = userRepository.findByGoogleId(info.getSub())
                .orElseGet(() -> createNewUser(info));

        String token = jwtService.createAccessToken(user.getEmail(), user.getRole().getId());
        ResLoginDTO res = new ResLoginDTO();
        res.setAccessToken(token);
        return res;
    }

    private User createNewUser(GoogleTokenInfoResDTO info) {
        Role candidateRole = roleRepository.findByName("CANDIDATE")
                .orElseThrow(() -> new IllegalArgumentException("Role ADMIN not found"));
        User user = User.builder()
                .googleId(info.getSub())
                .email(info.getEmail())
                .name(info.getName())
                .avatar(info.getPicture())
                .role(candidateRole)
                .build();
        return userRepository.save(user);
    }
}
