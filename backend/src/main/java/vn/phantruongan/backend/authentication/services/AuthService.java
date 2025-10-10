package vn.phantruongan.backend.authentication.services;

import org.apache.coyote.BadRequestException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import vn.phantruongan.backend.authentication.dtos.register.RegisterReqDTO;
import vn.phantruongan.backend.authentication.dtos.register.RegisterResDTO;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.UserRepository;

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
