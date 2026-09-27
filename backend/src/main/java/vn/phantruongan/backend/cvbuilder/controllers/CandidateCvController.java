package vn.phantruongan.backend.cvbuilder.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.cvbuilder.dtos.models.CvContentDTO;
import vn.phantruongan.backend.cvbuilder.dtos.models.CvThemeConfigDTO;
import vn.phantruongan.backend.cvbuilder.dtos.req.CreateCandidateCvReqDTO;
import vn.phantruongan.backend.cvbuilder.dtos.req.UpdateCandidateCvReqDTO;
import vn.phantruongan.backend.cvbuilder.dtos.res.CandidateCvResDTO;
import vn.phantruongan.backend.cvbuilder.services.CandidateCvService;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.error.InvalidException;

@RestController
@RequestMapping(ApiPaths.CANDIDATE_CVS)
@Tag(name = "Candidate CV Controller", description = "Quản lý CV tạo từ Interactive Resume Builder")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class CandidateCvController {

    private final CandidateCvService candidateCvService;

    @GetMapping
    @ApiMessage("Lấy danh sách CV thành công")
    @Operation(summary = "Lấy toàn bộ CV từ Builder của ứng viên hiện tại")
    public ResponseEntity<List<CandidateCvResDTO>> getMyCvs() throws InvalidException {
        return ResponseEntity.ok(candidateCvService.getMyCvs());
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy thông tin CV thành công")
    @Operation(summary = "Lấy chi tiết 1 CV theo ID")
    public ResponseEntity<CandidateCvResDTO> getCvById(@PathVariable Long id) throws InvalidException {
        return ResponseEntity.ok(candidateCvService.getCvById(id));
    }

    @PostMapping
    @ApiMessage("Tạo CV mới thành công")
    @Operation(summary = "Tạo mới một bản CV")
    public ResponseEntity<CandidateCvResDTO> createCv(@Valid @RequestBody CreateCandidateCvReqDTO dto) throws InvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(candidateCvService.createCv(dto));
    }

    @PutMapping("/{id}")
    @ApiMessage("Cập nhật CV thành công")
    @Operation(summary = "Cập nhật toàn bộ nội dung & cấu hình giao diện của CV")
    public ResponseEntity<CandidateCvResDTO> updateCv(@PathVariable Long id,
                                                       @RequestBody UpdateCandidateCvReqDTO dto) throws InvalidException {
        return ResponseEntity.ok(candidateCvService.updateCv(id, dto));
    }

    @PatchMapping("/{id}/theme")
    @ApiMessage("Cập nhật giao diện CV thành công")
    @Operation(summary = "Cập nhật riêng cấu hình giao diện (màu, font, khoảng cách) của CV")
    public ResponseEntity<CandidateCvResDTO> updateTheme(@PathVariable Long id,
                                                          @RequestBody CvThemeConfigDTO themeConfig) throws InvalidException {
        return ResponseEntity.ok(candidateCvService.updateThemeConfig(id, themeConfig));
    }

    @PatchMapping("/{id}/content")
    @ApiMessage("Cập nhật nội dung CV thành công")
    @Operation(summary = "Cập nhật riêng nội dung (personalInfo, skills, experience...) của CV")
    public ResponseEntity<CandidateCvResDTO> updateContent(@PathVariable Long id,
                                                            @RequestBody CvContentDTO content) throws InvalidException {
        return ResponseEntity.ok(candidateCvService.updateContent(id, content));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa CV thành công")
    @Operation(summary = "Xóa 1 CV của ứng viên")
    public ResponseEntity<Void> deleteCv(@PathVariable Long id) throws InvalidException {
        candidateCvService.deleteCv(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/duplicate")
    @ApiMessage("Nhân bản CV thành công")
    @Operation(summary = "Nhân bản một bản CV thành bản sao mới")
    public ResponseEntity<CandidateCvResDTO> duplicateCv(@PathVariable Long id) throws InvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(candidateCvService.duplicateCv(id));
    }

    @PutMapping("/{id}/set-default")
    @ApiMessage("Thiết lập CV mặc định thành công")
    @Operation(summary = "Đặt CV làm hồ sơ chính thức mặc định khi ứng tuyển")
    public ResponseEntity<CandidateCvResDTO> setDefaultCv(@PathVariable Long id) throws InvalidException {
        return ResponseEntity.ok(candidateCvService.setDefaultCv(id));
    }

    @PostMapping("/{id}/sync-pdf")
    @ApiMessage("Đồng bộ PDF thành công")
    @Operation(summary = "Cập nhật URL file PDF sau khi export lên CDN (Cloudinary)")
    public ResponseEntity<CandidateCvResDTO> syncPdfUrl(@PathVariable Long id,
                                                         @RequestParam(required = false) String pdfUrl,
                                                         @RequestParam(required = false) String thumbnailUrl) throws InvalidException {
        return ResponseEntity.ok(candidateCvService.syncPdfUrl(id, pdfUrl, thumbnailUrl));
    }
}
