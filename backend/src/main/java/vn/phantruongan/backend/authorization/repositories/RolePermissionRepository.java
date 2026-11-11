package vn.phantruongan.backend.authorization.repositories;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.authorization.entities.RolePermission;

@Repository
public interface RolePermissionRepository
        extends JpaRepository<RolePermission, Long>, JpaSpecificationExecutor<RolePermission> {

    interface PermissionCount {
        Long getRoleId();
        Long getPermissionCount();
    }

    @Query("SELECT rp.role.id AS roleId, COUNT(rp.id) AS permissionCount " +
            "FROM RolePermission rp WHERE rp.role.id IN :roleIds GROUP BY rp.role.id")
    List<PermissionCount> countPermissionsByRoleIds(@Param("roleIds") Collection<Long> roleIds);

    @Modifying
    @Query("DELETE FROM RolePermission rp WHERE rp.role.id = :roleId AND rp.permission.id IN :permissionIds")
    void deleteByRoleIdAndPermissionIds(@Param("roleId") Long roleId,
            @Param("permissionIds") List<Long> permissionIds);

}
