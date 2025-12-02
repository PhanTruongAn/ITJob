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
import vn.phantruongan.backend.bookmark.dtos.req.SaveJobReqDTO;
import vn.phantruongan.backend.bookmark.dtos.res.SavedJobResDTO;
import vn.phantruongan.backend.bookmark.services.SavedJobService;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.annotations.RequirePermission;

@RestController
@RequestMapping(ApiPaths.BOOKMARKS)
@RequiredArgsConstructor
@Tag(name = "Saved Job Controller", description = "Quản lý công việc đã lưu")
public class SavedJobController {
    private final SavedJobService savedJobService;

    @GetMapping("/jobs")
    @ApiMessage("Get list job saved")
    @RequirePermission(resource = ResourceEnum.JOB_SAVED, action = ActionEnum.READ)
    public ResponseEntity<PaginationResponse<SavedJobResDTO>> getListSavedJob(@ParameterObject Pageable pageable) {
        PaginationResponse<SavedJobResDTO> result = savedJobService.getSavedJobsByCandidate(pageable);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/jobs")
    @ApiMessage("Save job")
    @RequirePermission(resource = ResourceEnum.JOB_SAVED, action = ActionEnum.CREATE)
    public ResponseEntity<SavedJobResDTO> saveJob(@Valid @RequestBody SaveJobReqDTO dto) {
        return ResponseEntity.ok(savedJobService.saveJob(dto));
    }

    @DeleteMapping("/jobs/{id}")
    @ApiMessage("Unsave job")
    @RequirePermission(resource = ResourceEnum.JOB_SAVED, action = ActionEnum.DELETE)
    public ResponseEntity<Void> unsaveJob(@PathVariable("id") Long savedJobId) {
        savedJobService.unsaveJob(savedJobId);
        return ResponseEntity.ok().build();
    }
}
