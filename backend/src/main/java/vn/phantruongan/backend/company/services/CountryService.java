package vn.phantruongan.backend.company.services;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.company.dtos.req.country.CreateCountryReqDTO;
import vn.phantruongan.backend.company.dtos.req.country.UpdateCountryReqDTO;
import vn.phantruongan.backend.company.entities.Country;
import vn.phantruongan.backend.company.repositories.CountryRepository;
import vn.phantruongan.backend.util.error.InvalidException;

@Service
@RequiredArgsConstructor
public class CountryService {
    private final CountryRepository repository;

    public List<Country> getAllCountries() {
        return repository.findAll();
    }

    public Country createCountry(CreateCountryReqDTO dto) throws InvalidException {
        if (repository.existsByCode(dto.getCode())) {
            throw new InvalidException("Country code " + dto.getCode() + " already exists");
        }
        Country country = new Country();
        country.setCode(dto.getCode());
        country.setName(dto.getName());
        return repository.save(country);
    }

    public Country updateCountry(UpdateCountryReqDTO dto) throws InvalidException {
        Country country = repository.findById(dto.getId())
                .orElseThrow(() -> new InvalidException("Country id " + dto.getId() + " not found"));

        if (!country.getCode().equals(dto.getCode()) && repository.existsByCode(dto.getCode())) {
            throw new InvalidException("Country code " + dto.getCode() + " already exists");
        }

        country.setCode(dto.getCode());
        country.setName(dto.getName());
        return repository.save(country);
    }

    public void deleteCountryById(long id) throws InvalidException {
        Country country = repository.findById(id)
                .orElseThrow(() -> new InvalidException("Country id " + id + " not found"));
        repository.delete(country);
    }
}
