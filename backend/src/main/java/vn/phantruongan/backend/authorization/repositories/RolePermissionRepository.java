package vn.phantruongan.backend.authorization.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.authorization.entities.RolePermission;

@Repository
public interface RolePermissionRepository
                extends JpaRepository<RolePermission, Long>, JpaSpecificationExecutor<RolePermission> {

}
