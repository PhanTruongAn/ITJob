package vn.phantruongan.backend.authorization.enums;

import lombok.Getter;

@Getter
public enum ActionEnum {
    CREATE("Tạo mới"),
    READ("Xem"),
    UPDATE("Cập nhật"),
    DELETE("Xóa"),
    APPROVE("Duyệt"),
    REJECT("Từ chối"),
    APPLY("Ứng tuyển"),
    SAVE("Lưu"),
    UNSAVE("Bỏ lưu"),
    EXPORT("Xuất báo cáo"),
    VIEW("Xem chi tiết");

    private final String displayName;

    ActionEnum(String displayName) {
        this.displayName = displayName;
    }
}
