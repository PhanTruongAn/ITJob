package vn.phantruongan.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import vn.phantruongan.backend.domain.User;
import vn.phantruongan.backend.service.UserService;
import vn.phantruongan.backend.service.error.IdInvalidException;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/users")
    public ResponseEntity<User> createNewUser(@RequestBody User user) {
        User dataUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(dataUser);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUserById(@PathVariable("id") long id) throws IdInvalidException {
        if (id <= 0) {
            throw new IdInvalidException("Id must be a positive number!");
        }
        Boolean user = userService.deleteUserById(id);
        if (user) {
            return ResponseEntity.ok("Delete user successfully!");
        } else {
            return ResponseEntity.badRequest().body("Not found user to delete!");

        }

    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUser() {

        return ResponseEntity.ok(userService.getAllUser());

    }

    @PutMapping("/users")
    public ResponseEntity<User> putMethodName(@RequestBody User user) {
        User userUpdate = userService.updateUserById(user);
        return ResponseEntity.ok(userUpdate);
    }
}
