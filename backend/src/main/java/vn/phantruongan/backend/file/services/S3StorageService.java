package vn.phantruongan.backend.file.services;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import vn.phantruongan.backend.util.error.InvalidException;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3StorageService {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name:itjob-bucket}")
    private String bucketName;

    @Value("${aws.s3.region:ap-southeast-1}")
    private String region;

    public static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    public String[] uploadFile(MultipartFile file, String folderPath) throws InvalidException {
        if (file == null || file.isEmpty()) {
            throw new InvalidException("Tệp tin tải lên không được để trống.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidException("Dung lượng file vượt quá giới hạn tối đa 10MB.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            originalFilename = "file_" + UUID.randomUUID();
        }
        // Sanitize filename
        String sanitizedFilename = originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
        String fileKey = folderPath + "/" + System.currentTimeMillis() + "_" + sanitizedFilename;

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileKey)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            String fileUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, fileKey);
            log.info("Successfully uploaded file to AWS S3. Key: {}, URL: {}", fileKey, fileUrl);

            return new String[] { fileKey, fileUrl };
        } catch (IOException e) {
            log.error("Failed to read input stream from multipart file", e);
            throw new InvalidException("Không thể đọc tệp tin tải lên: " + e.getMessage());
        } catch (Exception e) {
            log.error("Error uploading file to AWS S3", e);
            throw new InvalidException("Lỗi khi tải tệp tin lên AWS S3: " + e.getMessage());
        }
    }

    public void deleteFile(String fileKey) {
        if (fileKey == null || fileKey.isBlank()) {
            return;
        }
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileKey)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
            log.info("Successfully deleted file from AWS S3. Key: {}", fileKey);
        } catch (Exception e) {
            log.error("Error deleting file from AWS S3 with key: {}", fileKey, e);
        }
    }
}
