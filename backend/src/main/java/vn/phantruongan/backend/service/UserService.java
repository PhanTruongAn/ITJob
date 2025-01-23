package vn.phantruongan.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import vn.phantruongan.backend.domain.User;
import vn.phantruongan.backend.dto.ResCreateUserDTO;
import vn.phantruongan.backend.dto.ResUpdateUserDTO;
import vn.phantruongan.backend.dto.ResUserDTO;
import vn.phantruongan.backend.dto.ResultPaginationDTO;
import vn.phantruongan.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(User user) {
        String hashPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashPassword);
        return userRepository.save(user);
    }

    public ResCreateUserDTO responseCreateUser(User user) {
        ResCreateUserDTO dto = new ResCreateUserDTO();
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setAddress(user.getAddress());
        dto.setDob(user.getDob());
        dto.setGender(user.getGender());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    public boolean deleteUserById(long id) {
        Optional<User> op = userRepository.findById(id);
        if (op.isPresent()) {
            userRepository.deleteById(op.get().getId());
            return true;
        }
        return false;

    }

    public User getUserById(long id) {
        Optional<User> op = userRepository.findById(id);
        if (op.isPresent()) {
            return op.get();
        }
        return null;
    }

    public ResultPaginationDTO getAllUser(Specification<User> spec, Pageable pageable) {
        Page<User> page = userRepository.findAll(spec, pageable);
        ResultPaginationDTO result = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();
        meta.setPageNumber(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(page.getTotalPages());
        meta.setTotal(page.getTotalElements());

        List<ResUserDTO> dto = page.getContent().stream()
                .map(item -> new ResUserDTO(item.getId(), item.getName(), item.getEmail(),
                        item.getDob(), item.getGender(), item.getAddress(), item.getCreatedAt(), item.getUpdatedAt())

                ).collect(Collectors.toList());
        result.setMeta(meta);
        result.setResult(dto);
        return result;
    }

    public ResUpdateUserDTO updateUserById(User user) {
        User userUpdate = getUserById(user.getId());
        ResUpdateUserDTO dto = new ResUpdateUserDTO();
        if (userUpdate != null) {
            userUpdate.setName(user.getName());
            userUpdate.setAddress(user.getAddress());
            userUpdate.setDob(user.getDob());
            userUpdate.setGender(user.getGender());
            userRepository.save(userUpdate);
            dto.setId(user.getId());
            dto.setName(user.getName());
            dto.setGender(user.getGender());
            dto.setAddress(user.getAddress());
            dto.setDob(user.getDob());
            dto.setUpdatedAt(userUpdate.getUpdatedAt());
        }
        return dto;

    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean existUserByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public void updateRefreshToken(String email, String refreshToken) {
        User user = findUserByEmail(email);
        if (user != null) {
            user.setRefreshToken(refreshToken);
            userRepository.save(user);
        }
    }

    public User getUserByRefreshTokenAndEmail(String token, String email) {
        return userRepository.findByRefreshTokenAndEmail(token, email);
    }
}
