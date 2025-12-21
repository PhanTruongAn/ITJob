package vn.phantruongan.backend.authentication.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authentication.dtos.req.CreateUserReqDTO;
import vn.phantruongan.backend.authentication.dtos.req.GetListUserReqDTO;
import vn.phantruongan.backend.authentication.dtos.req.UpdateUserReqDTO;
import vn.phantruongan.backend.authentication.dtos.res.UserResDTO;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.mappers.UserMapper;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.authentication.specification.UserSpecification;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.util.error.InvalidException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    // Get list user with filter
    public PaginationResponse<UserResDTO> getListUser(GetListUserReqDTO dto, Pageable pageable) {
        Specification<User> spec = new UserSpecification(dto);
        Page<User> page = userRepository.findAll(spec, pageable);

        List<UserResDTO> list = userMapper.toDtoList(page.getContent());

        PaginationResponse.Meta meta = new PaginationResponse.Meta(
                page.getNumber() + 1,
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());

        return new PaginationResponse<>(list, meta);
    }

    public UserResDTO createUser(CreateUserReqDTO dto) throws InvalidException {
        User user = userMapper.toEntity(dto);
        if (existUserByEmail(dto.getEmail())) {
            throw new InvalidException(
                    "This email already exists, please use a different one.");
        } else if (userRepository.existsByPhoneAndDeletedAtIsNull(dto.getPhone())) {
            throw new InvalidException(
                    "This phone number already exists, please use a different one.");
        }
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }

    public UserResDTO updateUser(UpdateUserReqDTO dto) throws InvalidException {
        User existingUser = userRepository.findById(dto.getId())
                .orElseThrow(() -> new InvalidException("User not found"));

        if (userRepository.existsByPhoneAndDeletedAtIsNull(dto.getPhone())) {
            throw new InvalidException(
                    "This phone number already exists, please use a different one.");
        }
        // Map các field từ DTO sang entity hiện tại
        userMapper.updateEntityFromDto(dto, existingUser);

        User updatedUser = userRepository.save(existingUser);
        return userMapper.toDto(updatedUser);
    }

    public boolean deleteUserById(long id) throws InvalidException {
        if (id <= 0) {
            throw new InvalidException("User ID must be a positive number.");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new InvalidException("User not found."));

        userRepository.delete(user);
        return true;
    }

    public UserResDTO getUserById(long id) throws InvalidException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new InvalidException("User not found with id: " + id));

        return userMapper.toDto(user);
    }

    // public Optional<User> findUserByEmail(String email) {
    // return userRepository.findByEmail(email);
    // }

    public boolean existUserByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

}
