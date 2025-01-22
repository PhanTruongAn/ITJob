package vn.phantruongan.backend.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import vn.phantruongan.backend.domain.User;
import vn.phantruongan.backend.dto.ResultPaginationDTO;
import vn.phantruongan.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        return userRepository.save(user);
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
            userUpdate.setPassword((user.getPassword()));
            userUpdate = userRepository.save(userUpdate);
            return userUpdate;
        }
        return userRepository.save(user);
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);

    }
}
