package vn.phantruongan.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cloudinary.Cloudinary;

@RestController
@RequestMapping("/api/v1")
public class FileController {

    private final Cloudinary cloudinary;

    public FileController(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Value("${cloudinary.upload-preset}")
    private String uploadPreset;

    @GetMapping("/file/signed")
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
                "uploadUrl", uploadUrl

        );

    }
}
