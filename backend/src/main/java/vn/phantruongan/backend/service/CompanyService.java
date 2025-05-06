package vn.phantruongan.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import vn.phantruongan.backend.domain.Company;
import vn.phantruongan.backend.dto.ResultPaginationDTO;
import vn.phantruongan.backend.dto.common.ResDeleteDTO;
import vn.phantruongan.backend.dto.filter.company.CompanyFilter;
import vn.phantruongan.backend.repository.CompanyRepository;
import vn.phantruongan.backend.specification.company.CompanySpecification;

@Service
public class CompanyService {
    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public boolean isExistCompany(String name, long countryId) {
        if (companyRepository.existsByNameAndCountry_Id(name, countryId)) {
            return true;
        }
        return false;
    }

    public Company createCompany(Company company) {
        return companyRepository.save(company);
    }

    public Company findById(long id) {
        return companyRepository.findById(id).orElse(null);
    }

    public ResultPaginationDTO getAllCompanies(CompanyFilter filter, Pageable pageable) {
        Specification<Company> spec = new CompanySpecification(filter);
        Page<Company> page = companyRepository.findAll(spec, pageable);
        ResultPaginationDTO result = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();
        meta.setPageNumber(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(page.getTotalPages());
        meta.setTotal(page.getTotalElements());

        result.setMeta(meta);
        result.setResult(page.getContent());
        return result;
    }

    public boolean deleteCompanyById(long id) {
        Optional<Company> op = companyRepository.findById(id);
        if (op.isPresent()) {
            companyRepository.deleteById(op.get().getId());
            return true;
        }
        return false;
    }

    public Company updateById(Company company) {
        Company currentCompany = findById(company.getId());
        if (currentCompany != null) {
            currentCompany.setName(company.getName());
            currentCompany.setAddress(company.getAddress());
            currentCompany.setDescription(company.getDescription());
            currentCompany.setLogo(company.getLogo());
            currentCompany.setOvertime(company.isOvertime());
            currentCompany.setCompanySize(company.getCompanySize());
            currentCompany.setCompanyType(company.getCompanyType());
            currentCompany.setIndustry(company.getIndustry());
            currentCompany.setWorkingDays(company.getWorkingDays());
            return companyRepository.save(currentCompany);
        }
        return null;

    }

    // public ResultPaginationDTO filterCompanies(Specification<Company>
    // specification) {
    // List<Company> companies = companyRepository.findAll(specification);
    // ResultPaginationDTO result = new ResultPaginationDTO();
    // ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();
    // result.setMeta(meta);
    // result.setResult(companies);
    // return result;
    // }
}
