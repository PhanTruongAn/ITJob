package vn.phantruongan.backend.resume.controllers;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.resume.dtos.req.CreateResumeReqDTO;
import vn.phantruongan.backend.resume.dtos.req.GetListResumeReqDTO;
import vn.phantruongan.backend.resume.dtos.req.UpdateResumeReqDTO;
import vn.phantruongan.backend.resume.dtos.res.ResumeResDTO;
import vn.phantruongan.backend.resume.services.ResumeService;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.annotations.RequirePermission;
import vn.phantruongan.backend.util.error.InvalidException;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Resume Controller", description = "Quản lý hồ sơ ứng tuyển")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @RequirePermission(resource = ResourceEnum.RESUME, action = ActionEnum.READ)
    @GetMapping("/resumes")
    @ApiMessage("Get list resumes with filter")
    public ResponseEntity<PaginationResponse<ResumeResDTO>> getAllResumes(
            @ParameterObject GetListResumeReqDTO dto,
            @ParameterObject Pageable pageable) {

        PaginationResponse<ResumeResDTO> result = resumeService.getAllResumes(dto, pageable);
        return ResponseEntity.ok(result);
    }

    @RequirePermission(resource = ResourceEnum.RESUME, action = ActionEnum.CREATE)
    @PostMapping("/resumes")
    @ApiMessage("Create new resume")
    public ResponseEntity<ResumeResDTO> createResume(@Valid @RequestBody CreateResumeReqDTO dto)
            throws InvalidException {

        ResumeResDTO newResume = resumeService.createResume(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newResume);
    }

    @RequirePermission(resource = ResourceEnum.RESUME, action = ActionEnum.UPDATE)
    @PutMapping("/resumes")
    @ApiMessage("Resume updated")
    public ResponseEntity<ResumeResDTO> updateResume(@Valid @RequestBody UpdateResumeReqDTO dto)
            throws InvalidException {

        ResumeResDTO updated = resumeService.updateResume(dto);
        return ResponseEntity.ok(updated);
    }

    @RequirePermission(resource = ResourceEnum.RESUME, action = ActionEnum.READ)
    @GetMapping("/resumes/{id}")
    @ApiMessage("Get resume by id")
    public ResponseEntity<ResumeResDTO> findResumeById(@PathVariable("id") long id)
            throws InvalidException {

        ResumeResDTO resume = resumeService.findById(id);
        return ResponseEntity.ok(resume);
    }

    @RequirePermission(resource = ResourceEnum.RESUME, action = ActionEnum.DELETE)
    @DeleteMapping("/resumes/{id}")
    @ApiMessage("Resume deleted")
    public ResponseEntity<Boolean> deleteResume(@PathVariable("id") long id)
            throws InvalidException {

        boolean deleted = resumeService.deleteResumeById(id);
        return ResponseEntity.ok(deleted);
    }

    @RequirePermission(resource = ResourceEnum.RESUME, action = ActionEnum.UPDATE)
    @PutMapping("/resumes/{id}/approve")
    @ApiMessage("Approve resume")
    public ResponseEntity<ResumeResDTO> approveResume(@PathVariable("id") long id)
            throws InvalidException {

        ResumeResDTO result = resumeService.approveResume(id);
        return ResponseEntity.ok(result);
    }

    @RequirePermission(resource = ResourceEnum.RESUME, action = ActionEnum.UPDATE)
    @PutMapping("/resumes/{id}/reject")
    @ApiMessage("Reject resume")
    public ResponseEntity<ResumeResDTO> rejectResume(
            @PathVariable("id") long id,
            @RequestParam(value = "note", required = false) String note)
            throws InvalidException {

        ResumeResDTO result = resumeService.rejectResume(id, note);
        return ResponseEntity.ok(result);
    }

    @RequirePermission(resource = ResourceEnum.RESUME, action = ActionEnum.UPDATE)
    @PutMapping("/resumes/{id}/review")
    @ApiMessage("Review resume")
    public ResponseEntity<ResumeResDTO> reviewResume(@PathVariable("id") long id)
            throws InvalidException {

        ResumeResDTO result = resumeService.reviewResume(id);
        return ResponseEntity.ok(result);
    }

}