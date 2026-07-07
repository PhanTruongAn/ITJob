package vn.phantruongan.backend.follow.controllers;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.follow.dtos.req.FollowReqDTO;
import vn.phantruongan.backend.follow.dtos.res.CompanyFollowResDTO;
import vn.phantruongan.backend.follow.services.CompanyFollowService;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.annotations.RequirePermission;

@RestController
@RequestMapping(ApiPaths.FOLLOWS)
@RequiredArgsConstructor
@Tag(name = "Company Follow Controller", description = "Quản lý theo dõi công ty")
public class CompanyFollowController {

    private final CompanyFollowService companyFollowService;

    @PostMapping("/companies")
    @ApiMessage("Toggle follow company")
    @RequirePermission(resource = ResourceEnum.COMPANY_FOLLOW, action = ActionEnum.CREATE)
    public ResponseEntity<CompanyFollowResDTO> toggleFollow(@RequestBody FollowReqDTO req) {
        return ResponseEntity.ok(companyFollowService.toggleFollow(req.getCompanyId()));
    }

    @GetMapping("/companies/{companyId}/status")
    @ApiMessage("Get company follow status")
    @RequirePermission(resource = ResourceEnum.COMPANY_FOLLOW, action = ActionEnum.READ)
    public ResponseEntity<Boolean> getFollowStatus(@PathVariable Long companyId) {
        return ResponseEntity.ok(companyFollowService.isFollowing(companyId));
    }

    @GetMapping("/companies")
    @ApiMessage("Get list followed companies")
    @RequirePermission(resource = ResourceEnum.COMPANY_FOLLOW, action = ActionEnum.READ)
    public ResponseEntity<PaginationResponse<CompanyFollowResDTO>> getListFollowedCompany(
            @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(companyFollowService.getFollowedCompanies(pageable));
    }
}
