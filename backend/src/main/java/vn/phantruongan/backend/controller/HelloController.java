package vn.phantruongan.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.phantruongan.backend.util.error.IdInvalidException;

@RestController
public class HelloController {
    @GetMapping("/")
    public String getHelloWorld() throws IdInvalidException {
        if (true)
            throw new IdInvalidException("Check error vsbfjdf!");
        return "Hello World";
    }
}
