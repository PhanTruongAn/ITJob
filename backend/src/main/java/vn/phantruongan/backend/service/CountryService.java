package vn.phantruongan.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import vn.phantruongan.backend.domain.Country;
import vn.phantruongan.backend.repository.CountryRepository;

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
