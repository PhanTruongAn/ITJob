package vn.phantruongan.backend.initialization;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.phantruongan.backend.authorization.entities.Permission;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.MethodEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.authorization.repositories.PermissionRepository;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(2)
public class PermissionDataInitializer {

    private final PermissionRepository permissionRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void initPermissions() {
        // Nếu đã có permission rồi -> bỏ qua hoàn toàn (chỉ seed lần đầu)
        if (permissionRepository.count() > 0) {
            log.info("Permissions đã được khởi tạo → Bỏ qua seed lại");
            return;
        }

        log.info("Bắt đầu tự động sinh 5 permission base cho từng resource...");

        long start = System.currentTimeMillis();
        List<Permission> toSave = new ArrayList<>();

        for (ResourceEnum resource : ResourceEnum.values()) {
            String base = "/api/v1" + resource.getBasePath();

            // 1. LIST - GET danh sách
            addIfNotExists(toSave, resource, ActionEnum.READ, MethodEnum.GET, base);

            // 2. CREATE - POST tạo mới
            addIfNotExists(toSave, resource, ActionEnum.CREATE, MethodEnum.POST, base);

            // 3. UPDATE - PUT cập nhật
            addIfNotExists(toSave, resource, ActionEnum.UPDATE, MethodEnum.PUT, base);

            // 4. DETAIL - GET chi tiết 1 bản ghi
            addIfNotExists(toSave, resource, ActionEnum.READ, MethodEnum.GET, base + "/{id}");

            // 5. DELETE - DELETE xóa
            addIfNotExists(toSave, resource, ActionEnum.DELETE, MethodEnum.DELETE, base + "/{id}");
        }

        if (!toSave.isEmpty()) {
            permissionRepository.saveAll(toSave);
            log.info("ĐÃ TẠO THÀNH CÔNG {} permission(s)!", toSave.size());
        }

        log.info("Hoàn tất trong {}ms", System.currentTimeMillis() - start);
    }

    private void addIfNotExists(List<Permission> list, ResourceEnum resource, ActionEnum action,
            MethodEnum method, String apiPath) {
        if (permissionRepository.existsByResourceAndActionAndMethodAndApiPath(resource, action, method, apiPath)) {
            return;
        }

        Permission p = new Permission();
        String actionName = action.getDisplayName();

        if (method == MethodEnum.GET && apiPath.contains("{id}")) {
            p.setName(resource.getDisplayName() + " - Xem chi tiết");
        } else {
            p.setName(resource.getDisplayName() + " - " + actionName);
        }

        p.setResource(resource);
        p.setAction(action);
        p.setMethod(method);
        p.setApiPath(apiPath);

        list.add(p);
    }

}