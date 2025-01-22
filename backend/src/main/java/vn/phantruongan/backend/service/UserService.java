package vn.phantruongan.backend.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import vn.phantruongan.backend.domain.User;
import vn.phantruongan.backend.dto.CreateUserDTO;
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

    public CreateUserDTO responseCreateUser(User user) {
        CreateUserDTO dto = new CreateUserDTO();
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

        result.setMeta(meta);
        result.setResult(page.getContent());
        return result;
    }

    public User updateUserById(User user) {
        User userUpdate = getUserById(user.getId());
        if (userUpdate != null) {
            userUpdate.setName(user.getName());
            userUpdate.setEmail(user.getEmail());
            userUpdate.setAddress(user.getAddress());
            userUpdate.setDob(user.getDob());
            userUpdate.setGender(user.getGender());
            userUpdate = userRepository.save(userUpdate);
            return userUpdate;
        }
        return userRepository.save(user);
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean existUserByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
