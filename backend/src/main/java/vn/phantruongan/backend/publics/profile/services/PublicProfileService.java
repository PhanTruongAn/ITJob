package vn.phantruongan.backend.publics.profile.services;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import vn.phantruongan.backend.authentication.dtos.res.UserResDTO;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.mappers.UserMapper;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.common.security.CurrentUserService;
import vn.phantruongan.backend.profile.dtos.req.ChangePasswordReqDTO;
import vn.phantruongan.backend.publics.profile.dtos.req.PublicUpdateProfileReqDTO;
import vn.phantruongan.backend.util.error.InvalidException;

@Service
@AllArgsConstructor
public class PublicProfileService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserService currentUserService;

    // Get current user profile
    public Optional<UserResDTO> getUserProfile() {
        return userRepository.findByEmail(currentUserService.getCurrentUserEmail())
                .map(userMapper::toDto);
    }

    // Update current user profile
    public UserResDTO updateProfile(PublicUpdateProfileReqDTO dto) {
        User user = userRepository.findByEmail(currentUserService.getCurrentUserEmail())
                .orElseThrow(() -> new InvalidException("User not found"));
        userMapper.updatePublicProfileFromDto(dto, user);

        return userMapper.toDto(userRepository.save(user));
    }

    // Change password
    public void changePassword(ChangePasswordReqDTO dto) {
        User user = userRepository.findByEmail(currentUserService.getCurrentUserEmail())
                .orElseThrow(() -> new InvalidException("User not found"));

        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new InvalidException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);

    }
}
