package vn.phantruongan.backend.publics.review.controllers;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.review.dtos.res.CompanyReviewResDTO;
import vn.phantruongan.backend.review.services.CompanyReviewService;
import vn.phantruongan.backend.util.annotations.ApiMessage;

@RestController
@RequestMapping(ApiPaths.PUBLIC_REVIEWS)
@Tag(name = "Public Company Review Controller", description = "Quản lý đánh giá công ty công khai")
@RequiredArgsConstructor
public class PublicReviewController {

    private final CompanyReviewService companyReviewService;

    @GetMapping("/companies")
    @ApiMessage("Get all reviews of company publicly")
    public ResponseEntity<PaginationResponse<CompanyReviewResDTO>> getReviewsByCompany(
            @RequestParam long companyId,
            @ParameterObject Pageable pageable) {

        PaginationResponse<CompanyReviewResDTO> result = companyReviewService.getAllReviewsByCompanyId(companyId, pageable);
        return ResponseEntity.ok(result);
    }
}
