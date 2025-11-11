package vn.phantruongan.backend.log.enums;

public enum AuditActionEnum {
    CREATE("Tạo"),
    UPDATE("Cập nhật"),
    DELETE("Xóa"),
    APPROVE("Duyệt"),
    REJECT("Từ chối"),
    REVIEW("Đang xem xét");

    private final String displayName;

    AuditActionEnum(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
