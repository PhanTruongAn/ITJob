package vn.phantruongan.backend.authorization.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import vn.phantruongan.backend.authorization.entities.Permission;
import vn.phantruongan.backend.authorization.entities.Role;
import vn.phantruongan.backend.authorization.entities.RolePermission;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.MethodEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;

@SpringBootTest
@Transactional
class RolePermissionRepositoryIntegrationTest {
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PermissionRepository permissionRepository;
    @Autowired
    private RolePermissionRepository rolePermissionRepository;

    @Test
    void permissionCountQueryReturnsCountsOnlyForRequestedRoles() {
        String suffix = UUID.randomUUID().toString();
        Role roleWithPermissions = saveRole("COUNTED_" + suffix);
        Role roleWithoutPermissions = saveRole("EMPTY_" + suffix);
        Permission first = savePermission("first-" + suffix);
        Permission second = savePermission("second-" + suffix);
        saveRolePermission(roleWithPermissions, first);
        saveRolePermission(roleWithPermissions, second);

        List<RolePermissionRepository.PermissionCount> counts = rolePermissionRepository
                .countPermissionsByRoleIds(List.of(roleWithPermissions.getId(), roleWithoutPermissions.getId()));

        assertEquals(1, counts.size());
        assertEquals(roleWithPermissions.getId(), counts.get(0).getRoleId());
        assertEquals(2L, counts.get(0).getPermissionCount());
    }

    private Role saveRole(String name) {
        Role role = new Role();
        role.setName(name);
        role.setActive(true);
        return roleRepository.saveAndFlush(role);
    }

    private Permission savePermission(String path) {
        Permission permission = new Permission();
        permission.setName(path);
        permission.setApiPath("/test/" + path);
        permission.setMethod(MethodEnum.GET);
        permission.setAction(ActionEnum.READ);
        permission.setResource(ResourceEnum.JOB);
        return permissionRepository.saveAndFlush(permission);
    }

    private void saveRolePermission(Role role, Permission permission) {
        RolePermission rolePermission = new RolePermission();
        rolePermission.setRole(role);
        rolePermission.setPermission(permission);
        rolePermissionRepository.saveAndFlush(rolePermission);
    }
}
