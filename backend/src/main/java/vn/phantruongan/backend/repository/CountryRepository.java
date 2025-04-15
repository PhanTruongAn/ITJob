package vn.phantruongan.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.phantruongan.backend.domain.Country;

public interface CountryRepository extends JpaRepository<Country, Long> {
    boolean existsByCode(String code);
}