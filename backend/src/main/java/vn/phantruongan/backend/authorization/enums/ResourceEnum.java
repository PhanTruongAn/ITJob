package vn.phantruongan.backend.authorization.enums;

import lombok.Getter;

@Getter
public enum ResourceEnum {
    JOB("Công việc", "/jobs"),
    RESUME("Hồ sơ xin việc", "/resumes"),
    COMPANY("Công ty", "/companies"),
    APPLICATION("Ứng tuyển", "/applications"),
    JOB_SAVED("Việc làm đã lưu", "/bookmarks/jobs/saved"),
    COMPANY_SAVED("Công ty đã lưu", "/bookmarks/companies/saved"),
    NOTIFICATION("Thông báo", "/notifications"),
    USER("Người dùng", "/users"),
    ROLE("Vai trò", "/roles"),
    PERMISSION("Quyền", "/permissions"),
    DASHBOARD("Bảng điều khiển", "/dashboard"),
    STATISTICS("Thống kê", "/statistics"),
    REPORT("Báo cáo", "/reports"),
    SUBSCRIBER("Người đăng ký", "/subscribers"),
    SKILL("Kỹ năng", "/skills"),
    COUNTRY("Quốc gia", "/countries");

    private final String displayName;
    private final String basePath;

    ResourceEnum(String displayName, String basePath) {
        this.displayName = displayName;
        this.basePath = basePath;
    }
}