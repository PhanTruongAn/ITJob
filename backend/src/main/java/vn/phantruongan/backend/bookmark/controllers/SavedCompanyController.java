package vn.phantruongan.backend.bookmark.controllers;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.bookmark.dtos.req.SaveCompanyReqDTO;
import vn.phantruongan.backend.bookmark.dtos.res.SavedCompanyResDTO;
import vn.phantruongan.backend.bookmark.services.SavedCompanyService;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.annotations.RequirePermission;

@RestController
@RequestMapping(ApiPaths.BOOKMARKS)
@RequiredArgsConstructor
@Tag(name = "Saved Company Controller", description = "Quản lý công ty đã lưu")
public class SavedCompanyController {

    private final SavedCompanyService savedCompanyService;

    @GetMapping("/companies")
    @ApiMessage("Get list company saved")
    @RequirePermission(resource = ResourceEnum.COMPANY_SAVED, action = ActionEnum.READ)
    public ResponseEntity<PaginationResponse<SavedCompanyResDTO>> getListSavedCompany(
            @ParameterObject Pageable pageable) {
        PaginationResponse<SavedCompanyResDTO> result = savedCompanyService.getSavedCompaniesByCandidate(pageable);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/companies")
    @ApiMessage("Save company")
    @RequirePermission(resource = ResourceEnum.COMPANY_SAVED, action = ActionEnum.CREATE)
    public ResponseEntity<SavedCompanyResDTO> saveCompany(@Valid @RequestBody SaveCompanyReqDTO dto) {
        return ResponseEntity.ok(savedCompanyService.saveCompany(dto));
    }

    @DeleteMapping("/companies/{id}")
    @ApiMessage("Unsave company")
    @RequirePermission(resource = ResourceEnum.COMPANY_SAVED, action = ActionEnum.DELETE)
    public ResponseEntity<Void> unsaveCompany(@PathVariable("id") Long savedCompanyId) {
        savedCompanyService.unsaveCompany(savedCompanyId);
        return ResponseEntity.ok().build();
    }
}
