package vn.phantruongan.backend.file.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.file.dtos.res.FileResDTO;
import vn.phantruongan.backend.file.enums.FileCategoryEnum;
import vn.phantruongan.backend.file.services.FileService;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.error.InvalidException;

@RestController
@RequestMapping(ApiPaths.FILE)
@Tag(name = "File Controller", description = "Quản lý tệp tin và Upload CV")
public class FileController {

    private final Cloudinary cloudinary;
    private final FileService fileService;

    public FileController(Cloudinary cloudinary, FileService fileService) {
        this.cloudinary = cloudinary;
        this.fileService = fileService;
    }

    @Value("${cloudinary.upload-preset}")
    private String uploadPreset;

    @GetMapping("/signed")
    @ApiMessage("File signed")
    public Map<String, Object> getSignature() {
        long timestamp = System.currentTimeMillis() / 1000L;

        Map<String, Object> params = Map.of(
                "timestamp", timestamp,
                "upload_preset", uploadPreset);

        String signature = cloudinary.apiSignRequest(params, cloudinary.config.apiSecret);
        String uploadUrl = "https://api.cloudinary.com/v1_1/" + cloudinary.config.cloudName + "/image/upload";
        return Map.of(
                "signature", signature,
                "timestamp", timestamp,
                "apiKey", cloudinary.config.apiKey,
                "cloudName", cloudinary.config.cloudName,
                "uploadPreset", uploadPreset,
                "uploadUrl", uploadUrl);
    }

    @PostMapping("/cvs/upload")
    @ApiMessage("Upload CV thành công")
    @Operation(summary = "Upload CV lên AWS S3 (Tối đa 10MB)")
    public ResponseEntity<FileResDTO> uploadCv(@RequestParam("file") MultipartFile file) throws InvalidException {
        FileResDTO fileResDTO = fileService.uploadCv(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(fileResDTO);
    }

    @GetMapping("/cvs")
    @ApiMessage("Lấy danh sách CV của tôi thành công")
    @Operation(summary = "Lấy danh sách CV đã upload của Candidate hiện tại")
    public ResponseEntity<List<FileResDTO>> getMyCvs() throws InvalidException {
        List<FileResDTO> cvs = fileService.getMyCvs();
        return ResponseEntity.ok(cvs);
    }

    @PutMapping("/cvs/{id}/default")
    @ApiMessage("Thiết lập CV mặc định thành công")
    @Operation(summary = "Đặt 1 CV làm mặc định")
    public ResponseEntity<FileResDTO> setDefaultCv(@PathVariable("id") long id) throws InvalidException {
        FileResDTO fileResDTO = fileService.setDefaultCv(id);
        return ResponseEntity.ok(fileResDTO);
    }

    @DeleteMapping("/cvs/{id}")
    @ApiMessage("Xóa CV thành công")
    @Operation(summary = "Xóa CV khỏi AWS S3 và hệ thống")
    public ResponseEntity<Boolean> deleteCv(@PathVariable("id") long id) throws InvalidException {
        boolean deleted = fileService.deleteCv(id);
        return ResponseEntity.ok(deleted);
    }

    @PostMapping("/upload")
    @ApiMessage("Upload file thành công")
    @Operation(summary = "Upload file dùng chung (Excel, Avatar, Attachment,...)")
    public ResponseEntity<FileResDTO> uploadGenericFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", defaultValue = "OTHER") FileCategoryEnum category)
            throws InvalidException {
        FileResDTO fileResDTO = fileService.uploadGenericFile(file, category);
        return ResponseEntity.status(HttpStatus.CREATED).body(fileResDTO);
    }
}
