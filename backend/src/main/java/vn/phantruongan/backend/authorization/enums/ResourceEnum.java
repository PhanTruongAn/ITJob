package vn.phantruongan.backend.authorization.enums;

import lombok.Getter;

@Getter
public enum ResourceEnum {
    JOB("Công việc", "/jobs"),
    RESUME("Hồ sơ xin việc", "/resumes"),
    COMPANY("Công ty", "/companies"),
    APPLICATION("Ứng tuyển", "/applications"),
    JOB_SAVED("Việc làm đã lưu", "/me/jobs/saved"),
    NOTIFICATION("Thông báo", "/notifications"),
    USER("Người dùng", "/admin/users"),
    ROLE("Vai trò", "/admin/roles"),
    PERMISSION("Quyền", "/admin/permissions"),
    DASHBOARD("Bảng điều khiển", "/admin/dashboard"),
    STATISTICS("Thống kê", "/admin/statistics"),
    REPORT("Báo cáo", "/admin/reports"),
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