package vn.phantruongan.backend.service.auth;

import org.apache.coyote.BadRequestException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import vn.phantruongan.backend.domain.user.entities.User;
import vn.phantruongan.backend.dto.auth.register.RegisterReqDTO;
import vn.phantruongan.backend.dto.auth.register.RegisterResDTO;
import vn.phantruongan.backend.repository.user.UserRepository;
import vn.phantruongan.backend.service.user.UserService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserService userService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    public RegisterResDTO register(RegisterReqDTO dto) throws BadRequestException {

        if (userService.findUserByEmail(dto.getEmail()) != null) {
            throw new BadRequestException("Email already in use!");
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setName(dto.getName());
        user.setAvatar(dto.getAvatar());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        User savedUser = userRepository.save(user);

        // map sang response
        RegisterResDTO res = new RegisterResDTO();
        res.setId(savedUser.getId());
        res.setEmail(savedUser.getEmail());
        res.setName(savedUser.getName());
        res.setAvatar(savedUser.getAvatar());
        return res;
    }
}
