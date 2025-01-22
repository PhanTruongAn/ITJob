package vn.phantruongan.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.turkraft.springfilter.boot.Filter;

import vn.phantruongan.backend.domain.User;
import vn.phantruongan.backend.dto.CreateUserDTO;
import vn.phantruongan.backend.dto.ResultPaginationDTO;
import vn.phantruongan.backend.service.UserService;
import vn.phantruongan.backend.util.annotation.ApiMessage;
import vn.phantruongan.backend.util.error.InvalidException;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/v1")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;

    }

    @PostMapping("/users")
    @ApiMessage("Create new user")
    public ResponseEntity<CreateUserDTO> createNewUser(@RequestBody User user) throws InvalidException {
        if (userService.existUserByEmail(user.getEmail())) {
            throw new InvalidException(
                    "Email này đã tồn tại, vui lòng sử dụng email khác");
        }
        User dataUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.responseCreateUser(dataUser));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUserById(@PathVariable("id") long id) throws InvalidException {
        if (id <= 0) {
            throw new InvalidException("Id must be a positive number!");
        }
        Boolean user = userService.deleteUserById(id);
        if (user) {
            return ResponseEntity.ok("Delete user successfully!");
        }
        return ResponseEntity.ok("Delete user failed!");

    }

    @GetMapping("/users/{id}")
    @ApiMessage("Get user by id")
    public ResponseEntity<?> getUserById(@PathVariable("id") long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!");
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/users")
    @ApiMessage("Fetch all users")
    public ResponseEntity<ResultPaginationDTO> getAllUser(@Filter Specification<User> spec, Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUser(spec, pageable));
    }

    @PutMapping("/users")
    @ApiMessage("Update user by id")
    public ResponseEntity<User> putMethodName(@RequestBody User user) {
        User userUpdate = userService.updateUserById(user);
        return ResponseEntity.ok(userUpdate);
    }
}
