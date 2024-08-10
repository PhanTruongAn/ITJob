package vn.phantruongan.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import vn.phantruongan.backend.domain.User;
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
        userRepository.deleteById(id);
        return true;
    }

    public User getUserById(long id) {
        Optional<User> op = userRepository.findById(id);
        if (op.isPresent()) {
            return op.get();
        }
        return null;
    }

    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    public User updateUserById(User user) {
        User userUpdate = getUserById(user.getId());
        if (userUpdate != null) {
            userUpdate.setName(user.getName());
            userUpdate.setEmail(user.getEmail());
            userUpdate.setPassword((user.getPassword()));
            userUpdate = userRepository.save(userUpdate);
        }
        return userUpdate;
    }
}
