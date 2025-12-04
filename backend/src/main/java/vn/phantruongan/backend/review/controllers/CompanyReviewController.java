package vn.phantruongan.backend.review.controllers;

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

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.review.dtos.req.CreateCompanyReviewReqDTO;
import vn.phantruongan.backend.review.dtos.req.UpdateCompanyReviewReqDTO;
import vn.phantruongan.backend.review.dtos.res.CompanyReviewResDTO;
import vn.phantruongan.backend.review.services.CompanyReviewService;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.annotations.RequirePermission;
import vn.phantruongan.backend.util.error.InvalidException;

@RestController
@RequestMapping(ApiPaths.REVIEWS)
@Tag(name = "Company Review Controller", description = "Quản lý đánh giá công ty")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class CompanyReviewController {

    private final CompanyReviewService companyReviewService;

    @RequirePermission(resource = ResourceEnum.COMPANY_REVIEW, action = ActionEnum.READ)
    @GetMapping("/companies")
    @ApiMessage("Get all review of company")
    public ResponseEntity<PaginationResponse<CompanyReviewResDTO>> getAllCompanies(
            @ParameterObject long companyId,
            @ParameterObject Pageable pageable) {

        PaginationResponse<CompanyReviewResDTO> result = companyReviewService.getAllReviewsByCompanyId(companyId,
                pageable);
        return ResponseEntity.ok(result);
    }

    @RequirePermission(resource = ResourceEnum.COMPANY_REVIEW, action = ActionEnum.CREATE)
    @PostMapping()
    @ApiMessage("Create new company review")
    public ResponseEntity<CompanyReviewResDTO> createCompanyReview(@Valid @RequestBody CreateCompanyReviewReqDTO dto)
            throws InvalidException {

        CompanyReviewResDTO newCompanyReview = companyReviewService.createReview(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCompanyReview);
    }

    @RequirePermission(resource = ResourceEnum.COMPANY_REVIEW, action = ActionEnum.UPDATE)
    @PutMapping()
    @ApiMessage("Company review updated")
    public ResponseEntity<CompanyReviewResDTO> updateCompanyReview(@Valid @RequestBody UpdateCompanyReviewReqDTO dto)
            throws InvalidException {

        CompanyReviewResDTO companyReviewUpdated = companyReviewService.updateReview(dto);
        return ResponseEntity.ok(companyReviewUpdated);
    }

    @RequirePermission(resource = ResourceEnum.COMPANY_REVIEW, action = ActionEnum.READ)
    @GetMapping("/{id}")
    @ApiMessage("Get company review by id")
    public ResponseEntity<CompanyReviewResDTO> findCompanyReviewById(@PathVariable("id") long id)
            throws InvalidException {
        CompanyReviewResDTO companyReview = companyReviewService.getReview(id);
        return ResponseEntity.ok(companyReview);
    }

    @RequirePermission(resource = ResourceEnum.COMPANY_REVIEW, action = ActionEnum.DELETE)
    @DeleteMapping("/{id}")
    @ApiMessage("Company review deleted")
    public ResponseEntity<Void> deleteCompanyReview(@PathVariable("id") long id) throws InvalidException {
        companyReviewService.deleteReview(id);
        return ResponseEntity.ok().build();

    }

}
