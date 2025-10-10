package vn.phantruongan.backend.company.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.phantruongan.backend.company.entities.Country;

public interface CountryRepository extends JpaRepository<Country, Long> {
    boolean existsByCode(String code);
}