package vn.phantruongan.backend.file.enums;

import lombok.Getter;

@Getter
public enum FileCategoryEnum {
    CV("Hồ sơ ứng tuyển"),
    EXCEL("Tệp dữ liệu Excel"),
    AVATAR("Ảnh đại diện"),
    ATTACHMENT("Đính kèm"),
    OTHER("Tệp tin khác");

    private final String description;

    FileCategoryEnum(String description) {
        this.description = description;
    }
}
