package vn.phantruongan.backend.company.services;

import java.util.List;

import org.springframework.stereotype.Service;

import vn.phantruongan.backend.company.entities.Country;
import vn.phantruongan.backend.company.repositories.CountryRepository;

@Service
public class CountryService {
    private final CountryRepository repository;

    private CountryService(CountryRepository repository) {
        this.repository = repository;
    }

    public List<Country> getAllCountries() {
        return repository.findAll();
    }
}
