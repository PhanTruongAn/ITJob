package vn.phantruongan.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import vn.phantruongan.backend.domain.User;
import vn.phantruongan.backend.service.UserService;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
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

    @PostMapping("/user")
    public User createNewUser(@RequestBody User user) {
        User dataUser = userService.createUser(user);
        return dataUser;
    }

    @DeleteMapping("/user/{id}")
    public boolean deleteUserById(@PathVariable("id") long id) {
        return userService.deleteUserById(id);
    }

    @GetMapping("/user/{id}")
    public User getUserById(@PathVariable("id") long id) {
        return userService.getUserById(id);
    }

    @GetMapping("/user")
    public List<User> getAllUser() {

        return userService.getAllUser();

    }

    @PutMapping("/user")
    public User putMethodName(@RequestBody User user) {
        User userUpdate = userService.updateUserById(user);
        return userUpdate;
    }
}
