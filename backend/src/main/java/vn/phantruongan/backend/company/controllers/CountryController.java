package vn.phantruongan.backend.company.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.company.dtos.req.country.CreateCountryReqDTO;
import vn.phantruongan.backend.company.dtos.req.country.UpdateCountryReqDTO;
import vn.phantruongan.backend.company.entities.Country;
import vn.phantruongan.backend.company.services.CountryService;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.annotations.RequirePermission;
import vn.phantruongan.backend.util.error.InvalidException;

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

    @RequirePermission(resource = ResourceEnum.COUNTRY, action = ActionEnum.CREATE)
    @PostMapping()
    @ApiMessage("Create new country")
    public ResponseEntity<Country> createCountry(@Valid @RequestBody CreateCountryReqDTO dto) throws InvalidException {
        Country newCountry = service.createCountry(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCountry);
    }

    @RequirePermission(resource = ResourceEnum.COUNTRY, action = ActionEnum.UPDATE)
    @PutMapping()
    @ApiMessage("Country updated")
    public ResponseEntity<Country> updateCountry(@Valid @RequestBody UpdateCountryReqDTO dto) throws InvalidException {
        Country updatedCountry = service.updateCountry(dto);
        return ResponseEntity.ok(updatedCountry);
    }

    @RequirePermission(resource = ResourceEnum.COUNTRY, action = ActionEnum.DELETE)
    @DeleteMapping("/{id}")
    @ApiMessage("Country deleted")
    public ResponseEntity<Void> deleteCountry(@PathVariable("id") long id) throws InvalidException {
        service.deleteCountryById(id);
        return ResponseEntity.ok().build();
    }
}
