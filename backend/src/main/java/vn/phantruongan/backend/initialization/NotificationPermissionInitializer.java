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
import vn.phantruongan.backend.config.web.ApiPaths;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(4)
public class NotificationPermissionInitializer {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final RolePermissionRepository rolePermissionRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void initNotificationPermissions() {
        Optional<Role> candidateRoleOpt = roleRepository.findByName("CANDIDATE");
        if (candidateRoleOpt.isEmpty()) {
            log.warn("Cannot seed candidate notification permissions: CANDIDATE role was not found.");
            return;
        }

        List<Permission> toCreate = new ArrayList<>();
        ensurePermission(toCreate, ActionEnum.READ, MethodEnum.GET, ApiPaths.CANDIDATE_NOTIFICATIONS);
        ensurePermission(toCreate, ActionEnum.UPDATE, MethodEnum.PATCH,
                ApiPaths.CANDIDATE_NOTIFICATIONS + "/{id}/read");
        if (!toCreate.isEmpty()) {
            permissionRepository.saveAll(toCreate);
        }

        Role candidateRole = candidateRoleOpt.get();
        List<Permission> notificationPermissions = permissionRepository.findAllByResource(ResourceEnum.NOTIFICATION);
        int linked = 0;
        for (Permission permission : notificationPermissions) {
            boolean alreadyLinked = candidateRole.getRolePermissions().stream()
                    .anyMatch(link -> link.getPermission().getId().equals(permission.getId()));
            if (!alreadyLinked) {
                RolePermission link = new RolePermission();
                link.setRole(candidateRole);
                link.setPermission(permission);
                rolePermissionRepository.save(link);
                linked++;
            }
        }

        if (linked > 0) {
            log.info("Granted {} notification permissions to CANDIDATE.", linked);
        }
    }

    private void ensurePermission(List<Permission> toCreate, ActionEnum action, MethodEnum method, String apiPath) {
        if (permissionRepository.existsByResourceAndActionAndMethodAndApiPath(
                ResourceEnum.NOTIFICATION, action, method, apiPath)
                || permissionRepository.findByResourceAndAction(ResourceEnum.NOTIFICATION, action).isPresent()) {
            return;
        }

        Permission permission = new Permission();
        permission.setName(ResourceEnum.NOTIFICATION.getDisplayName() + " - " + action.getDisplayName());
        permission.setResource(ResourceEnum.NOTIFICATION);
        permission.setAction(action);
        permission.setMethod(method);
        permission.setApiPath(apiPath);
        toCreate.add(permission);
    }
}
