package vn.phantruongan.backend.company.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.company.dtos.req.CreateCompanyReqDTO;
import vn.phantruongan.backend.company.dtos.req.GetListCompanyReqDTO;
import vn.phantruongan.backend.company.dtos.req.UpdateCompanyReqDTO;
import vn.phantruongan.backend.company.dtos.res.CompanyResDTO;
import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.company.entities.Country;
import vn.phantruongan.backend.company.mappers.CompanyMapper;
import vn.phantruongan.backend.company.repositories.CompanyRepository;
import vn.phantruongan.backend.company.repositories.CountryRepository;
import vn.phantruongan.backend.company.specification.CompanySpecification;
import vn.phantruongan.backend.util.error.InvalidException;

@Service
public class CompanyService {
    private final CompanyRepository companyRepository;
    private final CountryRepository countryRepository;
    private final CompanyMapper companyMapper;

    public CompanyService(CompanyRepository companyRepository, CountryRepository countryRepository,
            CompanyMapper companyMapper) {
        this.companyRepository = companyRepository;
        this.countryRepository = countryRepository;
        this.companyMapper = companyMapper;
    }

    public boolean isExistCompany(String name, long countryId) {
        if (companyRepository.existsByNameAndCountry_Id(name, countryId)) {
            return true;
        }
        return false;
    }

    public CompanyResDTO createCompany(CreateCompanyReqDTO dto) throws InvalidException {
        Company company = companyMapper.toEntity(dto);

        if (isExistCompany(dto.getName(), dto.getCountryId())) {
            throw new InvalidException(
                    "The company already exists in this country!");
        }
        Country country = countryRepository.findById(dto.getCountryId())
                .orElseThrow(() -> new InvalidException("Country not found"));
        company.setCountry(country);
        Company savedCompany = companyRepository.save(company);
        return companyMapper.toDto(savedCompany);
    }

    public CompanyResDTO findById(long id) throws InvalidException {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Company not found with id: " + id));

        return companyMapper.toDto(company);
    }

    public CompanyResDTO updateCompany(UpdateCompanyReqDTO dto) throws InvalidException {
        Company existingCompany = companyRepository.findById(dto.getId())
                .orElseThrow(() -> new InvalidException("Company not found"));

        companyMapper.updateEntityFromDto(dto, existingCompany);

        Company companyUpdated = companyRepository.save(existingCompany);
        return companyMapper.toDto(companyUpdated);

    }

    public PaginationResponse<CompanyResDTO> getAllCompanies(GetListCompanyReqDTO dto, Pageable pageable) {
        Specification<Company> spec = new CompanySpecification(dto);
        Page<Company> page = companyRepository.findAll(spec, pageable);
        List<CompanyResDTO> list = page.getContent().stream()
                .map(companyMapper::toDto)
                .collect(Collectors.toList());

        PaginationResponse.Meta meta = new PaginationResponse.Meta(
                page.getNumber() + 1,
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());

        return new PaginationResponse<>(list, meta);
    }

    public boolean deleteCompanyById(long id) throws InvalidException {
        if (id <= 0) {
            throw new InvalidException("Company ID must be a positive number.");
        }

        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Company not found."));

        companyRepository.delete(company);
        return true;
    }

}
