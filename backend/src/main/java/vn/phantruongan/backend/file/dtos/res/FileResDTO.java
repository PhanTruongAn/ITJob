package vn.phantruongan.backend.file.dtos.res;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.phantruongan.backend.file.enums.FileCategoryEnum;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileResDTO {
    private long id;
    private String fileName;
    private String fileKey;
    private String fileUrl;
    private String fileType;
    private String fileExtension;
    private long fileSize;
    private FileCategoryEnum category;
    private boolean isDefault;
    private Instant createdAt;
    private String createdBy;
}
