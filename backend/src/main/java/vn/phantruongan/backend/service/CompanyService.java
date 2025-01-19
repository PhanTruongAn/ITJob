package vn.phantruongan.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.phantruongan.backend.domain.Company;
import vn.phantruongan.backend.dto.ResultPaginationDTO;
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

    public ResultPaginationDTO getAllCompanies(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber - 1, pageSize);
        Page<Company> page = companyRepository.findAll(pageable);
        ResultPaginationDTO result = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();
        meta.setPageNumber(page.getNumber() + 1);
        meta.setPageSize(page.getSize());
        meta.setPages(page.getTotalPages());
        meta.setTotal(page.getTotalElements());

        result.setMeta(meta);
        result.setResult(page.getContent());
        return result;
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
