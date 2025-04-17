package vn.phantruongan.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.phantruongan.backend.util.annotation.ApiMessage;
import vn.phantruongan.backend.domain.Country;
import vn.phantruongan.backend.service.CountryService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/v1")
public class CountryController {
    private final CountryService service;

    private CountryController(CountryService service) {
        this.service = service;
    }

    @GetMapping("/countries")
    @ApiMessage("Get all countries")
    public ResponseEntity<List<Country>> getAllCountries() {
        return ResponseEntity.ok(service.getAllCountries());
    }

}
