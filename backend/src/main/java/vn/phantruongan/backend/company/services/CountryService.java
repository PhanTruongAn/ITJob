package vn.phantruongan.backend.company.services;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.company.entities.Country;
import vn.phantruongan.backend.company.repositories.CountryRepository;

@Service
@RequiredArgsConstructor
public class CountryService {
    private final CountryRepository repository;

    public List<Country> getAllCountries() {
        return repository.findAll();
    }
}
