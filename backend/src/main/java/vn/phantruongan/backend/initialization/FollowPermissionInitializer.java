package vn.phantruongan.backend.initialization;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.phantruongan.backend.authorization.entities.Permission;
import vn.phantruongan.backend.authorization.entities.Role;
import vn.phantruongan.backend.authorization.entities.RolePermission;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.MethodEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.authorization.repositories.PermissionRepository;
import vn.phantruongan.backend.authorization.repositories.RolePermissionRepository;
import vn.phantruongan.backend.authorization.repositories.RoleRepository;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(3)
public class FollowPermissionInitializer {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final RolePermissionRepository rolePermissionRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void initFollowPermissions() {
        log.info("Bắt đầu khởi tạo quyền Follow và Review cho CANDIDATE...");

        Optional<Role> candidateRoleOpt = roleRepository.findByName("CANDIDATE");
        if (candidateRoleOpt.isEmpty()) {
            log.warn("Không tìm thấy role CANDIDATE trong DB, bỏ qua việc gán quyền.");
            return;
        }

        Role candidateRole = candidateRoleOpt.get();

        // 1. Khởi tạo permissions cho COMPANY_FOLLOW nếu chưa có
        List<Permission> followPermissions = new ArrayList<>();
        ensurePermission(followPermissions, ResourceEnum.COMPANY_FOLLOW, ActionEnum.CREATE, MethodEnum.POST, "/api/v1/follows/companies");
        ensurePermission(followPermissions, ResourceEnum.COMPANY_FOLLOW, ActionEnum.READ, MethodEnum.GET, "/api/v1/follows/companies");
        ensurePermission(followPermissions, ResourceEnum.COMPANY_FOLLOW, ActionEnum.READ, MethodEnum.GET, "/api/v1/follows/companies/{companyId}/status");

        if (!followPermissions.isEmpty()) {
            permissionRepository.saveAll(followPermissions);
            log.info("Đã tạo thêm {} permissions cho COMPANY_FOLLOW", followPermissions.size());
        }

        // 2. Gán các quyền cho CANDIDATE role
        List<ResourceEnum> resources = List.of(ResourceEnum.COMPANY_FOLLOW, ResourceEnum.COMPANY_REVIEW);

        int linkedCount = 0;
        for (ResourceEnum res : resources) {
            List<Permission> permissions = permissionRepository.findAllByResource(res);
            for (Permission perm : permissions) {
                boolean alreadyLinked = candidateRole.getRolePermissions().stream()
                        .anyMatch(rp -> rp.getPermission().getId().equals(perm.getId()));

                if (!alreadyLinked) {
                    RolePermission rp = new RolePermission();
                    rp.setRole(candidateRole);
                    rp.setPermission(perm);
                    rolePermissionRepository.save(rp);
                    linkedCount++;
                }
            }
        }

        if (linkedCount > 0) {
            log.info("Đã gán thành công {} quyền cho role CANDIDATE", linkedCount);
        } else {
            log.info("Role CANDIDATE đã có đầy đủ các quyền follow và review.");
        }
    }

    private void ensurePermission(List<Permission> list, ResourceEnum resource, ActionEnum action,
            MethodEnum method, String apiPath) {
        if (permissionRepository.existsByResourceAndActionAndMethodAndApiPath(resource, action, method, apiPath)
                || permissionRepository.findByResourceAndAction(resource, action).isPresent()) {
            return;
        }

        Permission p = new Permission();
        p.setName(resource.getDisplayName() + " - " + action.getDisplayName());
        p.setResource(resource);
        p.setAction(action);
        p.setMethod(method);
        p.setApiPath(apiPath);

        list.add(p);
    }
}
