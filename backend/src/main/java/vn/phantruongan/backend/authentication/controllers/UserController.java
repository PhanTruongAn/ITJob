package vn.phantruongan.backend.authentication.controllers;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import vn.phantruongan.backend.authentication.dtos.common.UserFilter;
import vn.phantruongan.backend.authentication.dtos.res.ResCreateUserDTO;
import vn.phantruongan.backend.authentication.dtos.res.ResUpdateUserDTO;
import vn.phantruongan.backend.authentication.dtos.res.ResUserDTO;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.services.UserService;
import vn.phantruongan.backend.common.dtos.ResultPaginationDTO;
import vn.phantruongan.backend.util.annotation.ApiMessage;
import vn.phantruongan.backend.util.error.InvalidException;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/v1")
@Tag(name = "User Controller", description = "Quản lý người dùng")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;

    }

    @PostMapping("/users")
    @ApiMessage("User created")
    public ResponseEntity<ResCreateUserDTO> createNewUser(@Valid @RequestBody User user) throws InvalidException {
        if (userService.existUserByEmail(user.getEmail())) {
            throw new InvalidException(
                    "This email already exists, please use a different one.");
        }
        User dataUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.responseCreateUser(dataUser));
    }

    @DeleteMapping("/users/{id}")
    @ApiMessage("User deleted")
    public ResponseEntity<?> deleteUserById(@PathVariable("id") long id) throws InvalidException {
        if (id <= 0) {
            throw new InvalidException("Id must be a positive number!");
        }
        boolean user = userService.deleteUserById(id);
        if (user) {
            return ResponseEntity.ok(user);
        } else {
            throw new InvalidException("Delete user failed, user not founded!");
        }

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
    @ApiMessage("Get all users")
    public ResponseEntity<ResultPaginationDTO> getAllUser(@ParameterObject UserFilter filter,
            @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(userService.filterUser(filter, pageable));
    }

    @GetMapping("/users/filter")
    @ApiMessage("User filtered")
    public ResponseEntity<ResultPaginationDTO> filterUser(@RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "phone", required = false) String phone, Pageable pageable) {
        UserFilter filter = new UserFilter(name, phone);
        return ResponseEntity.ok(userService.filterUser(filter, pageable));
    }

    @PutMapping("/users")
    @ApiMessage("User updated")
    public ResponseEntity<ResUpdateUserDTO> putMethodName(@RequestBody User user) throws InvalidException {
        ResUserDTO op = userService.getUserById(user.getId());
        if (op == null) {
            throw new InvalidException("User not found!");
        }
        ResUpdateUserDTO userUpdate = userService.updateUserById(user);
        return ResponseEntity.ok(userUpdate);
    }
}
