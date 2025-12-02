package vn.phantruongan.backend.company.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.company.entities.Country;
import vn.phantruongan.backend.company.services.CountryService;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.util.annotations.ApiMessage;

@RestController
@RequestMapping(ApiPaths.COUNTRIES)
@RequiredArgsConstructor
@Tag(name = "Country Controller", description = "Quản lý quốc gia")
public class CountryController {
    public final CountryService service;

    @GetMapping()
    @ApiMessage("Get all countries")
    public ResponseEntity<List<Country>> getAllCountries() {
        return ResponseEntity.ok(service.getAllCountries());
    }

}
