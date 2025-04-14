package vn.phantruongan.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;
import vn.phantruongan.backend.domain.User;
import vn.phantruongan.backend.dto.ResultPaginationDTO;
import vn.phantruongan.backend.dto.user.ResCreateUserDTO;
import vn.phantruongan.backend.dto.user.ResDeleteUserDTO;
import vn.phantruongan.backend.dto.user.ResUpdateUserDTO;
import vn.phantruongan.backend.dto.user.ResUserDTO;
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
    public ResponseEntity<ResCreateUserDTO> createNewUser(@Valid @RequestBody User user) throws InvalidException {
        if (userService.existUserByEmail(user.getEmail())) {
            throw new InvalidException(
                    "Email này đã tồn tại, vui lòng sử dụng email khác");
        }
        User dataUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.responseCreateUser(dataUser));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ResDeleteUserDTO> deleteUserById(@PathVariable("id") long id) throws InvalidException {
        if (id <= 0) {
            throw new InvalidException("Id must be a positive number!");
        }
        ResDeleteUserDTO user = userService.deleteUserById(id);
        if (user.isSuccess()) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(user);

    }

    @GetMapping("/users/{id}")
    @ApiMessage("Get user")
    public ResponseEntity<ResUserDTO> getUserById(@PathVariable("id") long id) throws InvalidException {
        ResUserDTO user = userService.getUserById(id);
        if (user == null) {
            throw new InvalidException("User not found!");
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/users")
    @ApiMessage("Fetch all users")
    public ResponseEntity<ResultPaginationDTO> getAllUser(@Filter Specification<User> spec, Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUser(spec, pageable));
    }

    @PutMapping("/users")
    @ApiMessage("Update user")
    public ResponseEntity<ResUpdateUserDTO> putMethodName(@RequestBody User user) throws InvalidException {
        ResUserDTO op = userService.getUserById(user.getId());
        if (op == null) {
            throw new InvalidException("User not found!");
        }
        ResUpdateUserDTO userUpdate = userService.updateUserById(user);
        return ResponseEntity.ok(userUpdate);
    }
}
