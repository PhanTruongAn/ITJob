package vn.phantruongan.backend.publics.resume.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.resume.dtos.req.CreateResumeReqDTO;
import vn.phantruongan.backend.resume.dtos.res.ResumeResDTO;
import vn.phantruongan.backend.resume.services.ResumeService;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.error.InvalidException;

@RestController
@RequestMapping(ApiPaths.PUBLIC_RESUMES)
@Tag(name = "Public Resume Controller", description = "Quản lý hồ sơ ứng tuyển công khai dành cho Candidate")
@RequiredArgsConstructor
public class PublicResumeController {

    private final ResumeService resumeService;

    @PostMapping()
    @ApiMessage("Ứng tuyển công việc thành công")
    @Operation(summary = "Ứng viên nộp hồ sơ CV vào công việc")
    public ResponseEntity<ResumeResDTO> applyResume(@Valid @RequestBody CreateResumeReqDTO dto)
            throws InvalidException {
        ResumeResDTO newResume = resumeService.createResume(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newResume);
    }

    @PostMapping("/by-user")
    @ApiMessage("Ứng tuyển công việc thành công")
    @Operation(summary = "Ứng viên nộp hồ sơ CV vào công việc")
    public ResponseEntity<ResumeResDTO> applyResumeByUser(@Valid @RequestBody CreateResumeReqDTO dto)
            throws InvalidException {
        ResumeResDTO newResume = resumeService.createResume(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newResume);
    }

    @GetMapping("/by-user")
    @ApiMessage("Lấy danh sách CV đã ứng tuyển của tôi thành công")
    @Operation(summary = "Lấy danh sách các đơn đã ứng tuyển của candidate hiện tại")
    public ResponseEntity<List<ResumeResDTO>> getMyResumes() throws InvalidException {
        List<ResumeResDTO> list = resumeService.getMyResumes();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/check-applied")
    @ApiMessage("Kiểm tra trạng thái ứng tuyển thành công")
    @Operation(summary = "Kiểm tra xem Candidate hiện tại đã ứng tuyển công việc này chưa")
    public ResponseEntity<ResumeResDTO> checkApplied(@RequestParam("jobId") long jobId) throws InvalidException {
        ResumeResDTO appliedResume = resumeService.checkApplied(jobId);
        return ResponseEntity.ok(appliedResume);
    }
}
