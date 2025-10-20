package vn.phantruongan.backend.company.controllers;

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

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.company.dtos.req.CreateCompanyReqDTO;
import vn.phantruongan.backend.company.dtos.req.GetListCompanyReqDTO;
import vn.phantruongan.backend.company.dtos.req.UpdateCompanyReqDTO;
import vn.phantruongan.backend.company.dtos.res.CompanyResDTO;
import vn.phantruongan.backend.company.repositories.CompanyRepository;
import vn.phantruongan.backend.company.services.CompanyService;
import vn.phantruongan.backend.util.annotation.ApiMessage;
import vn.phantruongan.backend.util.error.InvalidException;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Company Controller", description = "Quản lý công ty")
public class CompanyController {

    private final CompanyRepository companyRepository;

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService, CompanyRepository companyRepository) {
        this.companyService = companyService;
        this.companyRepository = companyRepository;
    }

    @GetMapping("/companies")
    @ApiMessage("Get list company with filter")
    public ResponseEntity<PaginationResponse<CompanyResDTO>> getAllCompanies(
            @ParameterObject GetListCompanyReqDTO dto,
            @ParameterObject Pageable pageable) {

        PaginationResponse<CompanyResDTO> result = companyService.getAllCompanies(dto, pageable);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/companies")
    @ApiMessage("Create new company")
    public ResponseEntity<CompanyResDTO> createCompany(@Valid @RequestBody CreateCompanyReqDTO dto)
            throws InvalidException {

        CompanyResDTO newCompany = companyService.createCompany(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCompany);
    }

    @PutMapping("/companies")
    @ApiMessage("Company updated")
    public ResponseEntity<CompanyResDTO> updateCompany(@Valid @RequestBody UpdateCompanyReqDTO dto)
            throws InvalidException {

        CompanyResDTO companyUpdated = companyService.updateCompany(dto);
        return ResponseEntity.ok(companyUpdated);
    }

    @GetMapping("/companies/{id}")
    @ApiMessage("Get company by id")
    public ResponseEntity<CompanyResDTO> findCompanyById(@PathVariable("id") long id) throws InvalidException {
        CompanyResDTO company = companyService.findById(id);
        return ResponseEntity.ok(company);
    }

    @DeleteMapping("/companies/{id}")
    @ApiMessage("Company deleted")
    public ResponseEntity<Boolean> deleteCompany(@PathVariable("id") long id) throws InvalidException {
        boolean isDelete = companyService.deleteCompanyById(id);

        return ResponseEntity.ok(isDelete);

    }

}
