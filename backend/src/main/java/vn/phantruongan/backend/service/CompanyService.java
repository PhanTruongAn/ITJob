package vn.phantruongan.backend.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import vn.phantruongan.backend.domain.Company;
import vn.phantruongan.backend.repository.CompanyRepository;

@Service
public class CompanyService {
    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public Company createCompany(Company company) {
        return companyRepository.save(company);
    }

    public Company findById(long id) {
        return companyRepository.findById(id).orElse(null);
    }
}
