package vn.phantruongan.backend.service;

import java.util.List;
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

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public boolean deleteCompanyById(long id) {
        return companyRepository.findById(id)
                .map(company -> {
                    companyRepository.deleteById(company.getId());
                    return true;
                }).orElse(false);
    }

    public Company updateById(Company company) {
        Company currentCompany = findById(company.getId());
        if (currentCompany != null) {
            currentCompany.setName(company.getName());
            currentCompany.setAddress(company.getAddress());
            currentCompany.setDescription(company.getDescription());
            currentCompany.setLogo(company.getLogo());
            currentCompany = companyRepository.save(currentCompany);
            return currentCompany;
        }
        return companyRepository.save(company);
    }
}
