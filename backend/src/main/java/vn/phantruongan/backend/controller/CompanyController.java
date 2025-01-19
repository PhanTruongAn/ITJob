package vn.phantruongan.backend.controller;

import org.springframework.web.bind.annotation.RestController;
import vn.phantruongan.backend.domain.Company;
import vn.phantruongan.backend.dto.ResultPaginationDTO;
import vn.phantruongan.backend.service.CompanyService;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
// @RequestMapping("/api")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping("/companies")
    public ResponseEntity<Company> createCompany(@RequestBody Company company) {
        // TODO: process POST request
        Company newCompany = companyService.createCompany(company);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCompany);
    }

    @GetMapping("/companies/{id}")
    public ResponseEntity<?> findCompanyById(@PathVariable("id") long id) {
        Company company = companyService.findById(id);
        if (company == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Company not found");
        }
        return ResponseEntity.ok(company);
    }

    @GetMapping("/companies")
    public ResponseEntity<ResultPaginationDTO> getAllCompanies(
            @RequestParam("pageNumber") Optional<String> pageNumberOptional,
            @RequestParam("pageSize") Optional<String> pageSizOptional) {

        String sPageNumber = pageNumberOptional.isPresent() ? pageNumberOptional.get() : "";
        String sPageSize = pageSizOptional.isPresent() ? pageSizOptional.get() : "";
        int pageNumber = Integer.parseInt(sPageNumber);
        int pageSize = Integer.parseInt(sPageSize);
        return ResponseEntity.ok(companyService.getAllCompanies(pageNumber, pageSize));
    }

    @DeleteMapping("/companies/{id}")
    public ResponseEntity<String> deleteCompany(@PathVariable("id") long id) {
        boolean isDelete = companyService.deleteCompanyById(id);
        if (isDelete) {
            return ResponseEntity.ok("Delete successfully!");
        } else {
            return ResponseEntity.badRequest().body("Delete fail!");
        }

    }

    @PutMapping("/companies")
    public ResponseEntity<Company> updateCompany(@RequestBody Company company) {
        return ResponseEntity.ok(companyService.updateById(company));
    }
}
