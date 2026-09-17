package vn.phantruongan.backend.file.services;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.common.security.CurrentUserService;
import vn.phantruongan.backend.file.dtos.res.FileResDTO;
import vn.phantruongan.backend.file.entities.File;
import vn.phantruongan.backend.file.enums.FileCategoryEnum;
import vn.phantruongan.backend.file.mappers.FileMapper;
import vn.phantruongan.backend.file.repositories.FileRepository;
import vn.phantruongan.backend.util.error.InvalidException;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {

    private final FileRepository fileRepository;
    private final S3StorageService s3StorageService;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final FileMapper fileMapper;

    private static final List<String> ALLOWED_CV_EXTENSIONS = Arrays.asList("pdf", "doc", "docx");

    @Transactional
    public FileResDTO uploadCv(MultipartFile multipartFile) throws InvalidException {
        User user = getCurrentUser();

        String originalFilename = multipartFile.getOriginalFilename();
        String extension = extractExtension(originalFilename);

        if (extension.isEmpty() || !ALLOWED_CV_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new InvalidException("Chỉ chấp nhận các định dạng file CV: .pdf, .doc, .docx");
        }

        // Upload file to AWS S3 bucket under "cvs/user_{id}"
        String[] uploadResult = s3StorageService.uploadFile(multipartFile, "cvs/user_" + user.getId());
        String fileKey = uploadResult[0];
        String fileUrl = uploadResult[1];

        List<File> existingCvs = fileRepository.findByUserAndCategoryOrderByCreatedAtDesc(user, FileCategoryEnum.CV);
        boolean isDefault = existingCvs.isEmpty();

        File cvFile = new File();
        cvFile.setFileName(originalFilename != null ? originalFilename : "CV_" + System.currentTimeMillis());
        cvFile.setFileKey(fileKey);
        cvFile.setFileUrl(fileUrl);
        cvFile.setFileType(multipartFile.getContentType());
        cvFile.setFileExtension(extension.toLowerCase());
        cvFile.setFileSize(multipartFile.getSize());
        cvFile.setCategory(FileCategoryEnum.CV);
        cvFile.setDefault(isDefault);
        cvFile.setUser(user);

        File savedFile = fileRepository.save(cvFile);
        log.info("Saved CV File record to database with ID: {}", savedFile.getId());

        return fileMapper.toDto(savedFile);
    }

    public List<FileResDTO> getMyCvs() throws InvalidException {
        User user = getCurrentUser();
        List<File> cvs = fileRepository.findByUserAndCategoryOrderByCreatedAtDesc(user, FileCategoryEnum.CV);
        return fileMapper.toDtoList(cvs);
    }

    @Transactional
    public FileResDTO setDefaultCv(long fileId) throws InvalidException {
        User user = getCurrentUser();

        File targetCv = fileRepository.findByIdAndUser(fileId, user)
                .orElseThrow(() -> new InvalidException("Không tìm thấy CV với ID: " + fileId));

        if (targetCv.getCategory() != FileCategoryEnum.CV) {
            throw new InvalidException("File này không phải là tệp tin CV.");
        }

        // Reset existing default CV if any
        Optional<File> currentDefault = fileRepository.findByUserAndCategoryAndIsDefaultTrue(user, FileCategoryEnum.CV);
        if (currentDefault.isPresent()) {
            File prevDefault = currentDefault.get();
            if (prevDefault.getId() != targetCv.getId()) {
                prevDefault.setDefault(false);
                fileRepository.save(prevDefault);
            }
        }

        targetCv.setDefault(true);
        File updatedCv = fileRepository.save(targetCv);
        return fileMapper.toDto(updatedCv);
    }

    @Transactional
    public boolean deleteCv(long fileId) throws InvalidException {
        User user = getCurrentUser();

        File targetCv = fileRepository.findByIdAndUser(fileId, user)
                .orElseThrow(() -> new InvalidException("Không tìm thấy CV với ID: " + fileId));

        boolean wasDefault = targetCv.isDefault();

        // Delete from S3 storage
        s3StorageService.deleteFile(targetCv.getFileKey());

        // Delete record from database
        fileRepository.delete(targetCv);

        // If deleted CV was default, set another remaining CV as default if available
        if (wasDefault) {
            List<File> remainingCvs = fileRepository.findByUserAndCategoryOrderByCreatedAtDesc(user, FileCategoryEnum.CV);
            if (!remainingCvs.isEmpty()) {
                File nextDefault = remainingCvs.get(0);
                nextDefault.setDefault(true);
                fileRepository.save(nextDefault);
            }
        }

        return true;
    }

    @Transactional
    public FileResDTO uploadGenericFile(MultipartFile multipartFile, FileCategoryEnum category) throws InvalidException {
        User user = getCurrentUser();
        String originalFilename = multipartFile.getOriginalFilename();
        String extension = extractExtension(originalFilename);

        String folder = category.name().toLowerCase() + "s/user_" + user.getId();
        String[] uploadResult = s3StorageService.uploadFile(multipartFile, folder);

        File fileEntity = new File();
        fileEntity.setFileName(originalFilename != null ? originalFilename : "File_" + System.currentTimeMillis());
        fileEntity.setFileKey(uploadResult[0]);
        fileEntity.setFileUrl(uploadResult[1]);
        fileEntity.setFileType(multipartFile.getContentType());
        fileEntity.setFileExtension(extension.toLowerCase());
        fileEntity.setFileSize(multipartFile.getSize());
        fileEntity.setCategory(category);
        fileEntity.setDefault(false);
        fileEntity.setUser(user);

        File saved = fileRepository.save(fileEntity);
        return fileMapper.toDto(saved);
    }

    private User getCurrentUser() throws InvalidException {
        String email = currentUserService.getCurrentUserEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidException("Không tìm thấy thông tin người dùng đang đăng nhập."));
    }

    private String extractExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}
