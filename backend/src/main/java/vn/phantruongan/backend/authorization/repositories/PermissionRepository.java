package vn.phantruongan.backend.authorization.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.authorization.entities.Permission;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.MethodEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long>, JpaSpecificationExecutor<Permission> {
    Optional<Permission> findByResourceAndAction(ResourceEnum resource, ActionEnum action);

    boolean existsByResourceAndAction(ResourceEnum resource, ActionEnum action);

    boolean existsByResourceAndActionAndMethodAndApiPath(
            ResourceEnum resource, ActionEnum action, MethodEnum method, String apiPath);
}
