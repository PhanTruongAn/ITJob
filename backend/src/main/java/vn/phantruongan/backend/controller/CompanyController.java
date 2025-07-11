package vn.phantruongan.backend.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.phantruongan.backend.domain.Company;
import vn.phantruongan.backend.dto.ResultPaginationDTO;
import vn.phantruongan.backend.dto.filter.company.CompanyFilter;
import vn.phantruongan.backend.repository.CompanyRepository;
import vn.phantruongan.backend.service.CompanyService;
import vn.phantruongan.backend.util.annotation.ApiMessage;
import vn.phantruongan.backend.util.enums.CompanyType;
import vn.phantruongan.backend.util.error.InvalidException;

@RestController
@RequestMapping("/api/v1")
public class CompanyController {

    private final CompanyRepository companyRepository;

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService, CompanyRepository companyRepository) {
        this.companyService = companyService;
        this.companyRepository = companyRepository;
    }

    @PostMapping("/companies")
    @ApiMessage("Create new company")
    public ResponseEntity<Company> createCompany(@RequestBody Company company) throws InvalidException {
        boolean isExistCompany = companyService.isExistCompany(company.getName(), company.getCountry().getId());
        if (isExistCompany) {
            throw new InvalidException(
                    "The company already exists in this country!");
        }
        Company newCompany = companyService.createCompany(company);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCompany);
    }

    @GetMapping("/companies/{id}")
    @ApiMessage("Get company by id")
    public ResponseEntity<?> findCompanyById(@PathVariable("id") long id) {
        Company company = companyService.findById(id);
        if (company == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Company not found");
        }
        return ResponseEntity.ok(company);
    }

    @GetMapping("/companies")
    @ApiMessage("Fetch all companies")
    public ResponseEntity<ResultPaginationDTO> getAllCompanies(
            @ParameterObject CompanyFilter filter,
            @ParameterObject Pageable pageable) throws InvalidException {
        CompanyType companyTypeEnum = null;
        String companyType = filter.getCompanyType() != null ? filter.getCompanyType().getDisplayName() : null;
        if (companyType != null && !companyType.isBlank()) {
            try {
                companyTypeEnum = CompanyType.fromDisplayName(companyType);
            } catch (IllegalArgumentException ex) {
                throw new InvalidException("Company type is invalid!");
            }
        }

        return ResponseEntity.ok(companyService.getAllCompanies(filter, pageable));
    }

    @DeleteMapping("/companies/{id}")
    @ApiMessage("Company deleted")
    public ResponseEntity<?> deleteCompany(@PathVariable("id") long id) throws InvalidException {
        boolean isDelete = companyService.deleteCompanyById(id);
        if (isDelete) {
            return ResponseEntity.ok(isDelete);
        } else {
            throw new InvalidException(
                    "Delete company failed, company not founded!");
        }

    }

    @PutMapping("/companies")
    @ApiMessage("Company updated")
    public ResponseEntity<Company> updateCompany(@RequestBody Company company) throws InvalidException {
        Company companyUpdated = companyService.updateById(company);
        if (companyUpdated == null) {
            throw new InvalidException(
                    "Update company failed, company not founded!");
        }
        return ResponseEntity.ok(companyUpdated);
    }

}
