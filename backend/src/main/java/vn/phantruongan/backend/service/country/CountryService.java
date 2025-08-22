package vn.phantruongan.backend.service.country;

import java.util.List;

import org.springframework.stereotype.Service;

import vn.phantruongan.backend.domain.Country;
import vn.phantruongan.backend.repository.company.CountryRepository;

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
