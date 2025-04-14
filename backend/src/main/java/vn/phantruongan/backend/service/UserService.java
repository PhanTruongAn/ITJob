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
import vn.phantruongan.backend.dto.ResultPaginationDTO;
import vn.phantruongan.backend.dto.filter.user.UserFilter;
import vn.phantruongan.backend.dto.user.ResCreateUserDTO;
import vn.phantruongan.backend.dto.user.ResDeleteUserDTO;
import vn.phantruongan.backend.dto.user.ResUpdateUserDTO;
import vn.phantruongan.backend.dto.user.ResUserDTO;
import vn.phantruongan.backend.repository.UserRepository;
import vn.phantruongan.backend.specification.user.UserSpecification;

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
        dto.setPhone(user.getPhone());
        dto.setName(user.getName());
        dto.setAddress(user.getAddress());
        dto.setDob(user.getDob());
        dto.setGender(user.getGender());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    public ResDeleteUserDTO deleteUserById(long id) {
        Optional<User> op = userRepository.findById(id);
        ResDeleteUserDTO dto = new ResDeleteUserDTO();
        if (op.isPresent()) {
            userRepository.deleteById(op.get().getId());

            dto.setMessage("Delete user successfully!");
            dto.setSuccess(true);

        } else {
            dto.setMessage("Delete user failed, user not found!");
            dto.setSuccess(false);
        }
        return dto;
    }

    public ResUserDTO getUserById(long id) {
        Optional<User> op = userRepository.findById(id);
        if (op.isPresent()) {
            ResUserDTO dto = new ResUserDTO();
            dto.setId(op.get().getId());
            dto.setEmail(op.get().getEmail());
            dto.setName(op.get().getName());
            dto.setPhone(op.get().getPhone());
            dto.setAddress(op.get().getAddress());
            dto.setDob(op.get().getDob());
            dto.setGender(op.get().getGender());
            dto.setCreatedAt(op.get().getCreatedAt());
            dto.setUpdatedAt(op.get().getUpdatedAt());
            return dto;
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
                .map(item -> new ResUserDTO(item.getId(), item.getName(), item.getPhone(), item.getEmail(),
                        item.getDob(), item.getGender(), item.getAddress(), item.getCreatedAt(), item.getUpdatedAt())

                ).collect(Collectors.toList());
        result.setMeta(meta);
        result.setResult(dto);
        return result;
    }

    // Filter user
    public ResultPaginationDTO filterUser(UserFilter filter, Pageable pageable) {
        Specification<User> spec = new UserSpecification(filter);
        Page<User> page = userRepository.findAll(spec, pageable);
        ResultPaginationDTO result = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();
        meta.setPageNumber(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(page.getTotalPages());
        meta.setTotal(page.getTotalElements());

        List<ResUserDTO> dto = page.getContent().stream()
                .map(item -> new ResUserDTO(item.getId(), item.getName(), item.getPhone(), item.getEmail(),
                        item.getDob(), item.getGender(), item.getAddress(), item.getCreatedAt(), item.getUpdatedAt())

                ).collect(Collectors.toList());
        result.setMeta(meta);
        result.setResult(dto);
        return result;
    }

    public ResUpdateUserDTO updateUserById(User user) {
        Optional<User> op = userRepository.findById(user.getId());
        if (!op.isPresent()) {
            return null;
        }
        User userUpdate = op.get();
        ResUpdateUserDTO dto = new ResUpdateUserDTO();
        if (userUpdate != null) {
            userUpdate.setName(user.getName());
            userUpdate.setPhone(user.getPhone());
            userUpdate.setAddress(user.getAddress());
            userUpdate.setDob(user.getDob());
            userUpdate.setGender(user.getGender());
            userRepository.save(userUpdate);
            dto.setId(user.getId());
            dto.setName(user.getName());
            dto.setPhone(user.getPhone());
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
