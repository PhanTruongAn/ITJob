package vn.phantruongan.backend.guest.controllers;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.company.dtos.req.GetListCompanyReqDTO;
import vn.phantruongan.backend.company.dtos.res.CompanyResDTO;
import vn.phantruongan.backend.company.services.CompanyService;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.error.InvalidException;

@RestController
@RequestMapping(ApiPaths.PUBLIC_COMPANIES)
@Tag(name = "Public Company Controller", description = "Quản lý công ty công khai")
@RequiredArgsConstructor
public class PublicCompanyController {
    private final CompanyService companyService;

    @GetMapping()
    @ApiMessage("Get list company with filter")
    public ResponseEntity<PaginationResponse<CompanyResDTO>> getAllCompanies(
            @ParameterObject GetListCompanyReqDTO dto,
            @ParameterObject Pageable pageable) {

        PaginationResponse<CompanyResDTO> result = companyService.getAllCompanies(dto, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @ApiMessage("Get company by id")
    public ResponseEntity<CompanyResDTO> findCompanyById(@PathVariable("id") long id) throws InvalidException {
        CompanyResDTO company = companyService.findById(id);
        return ResponseEntity.ok(company);
    }
}
