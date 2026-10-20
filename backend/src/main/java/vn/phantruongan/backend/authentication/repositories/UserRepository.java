package vn.phantruongan.backend.authentication.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findByGoogleId(String googleId);

    Optional<User> findByEmail(String email);

    List<User> findAllByCompany_IdAndRole_NameIgnoreCase(Long companyId, String roleName);

    @Query("select distinct u from User u where u.deleted = false and u.role.active = true "
            + "and (upper(u.role.name) = 'ADMIN' or (upper(u.role.name) = 'MANAGER' and exists "
            + "(select rp.id from RolePermission rp where rp.role = u.role "
            + "and rp.permission.resource = :resource and rp.permission.action = :action)))")
    List<User> findActiveReviewers(@Param("resource") ResourceEnum resource,
            @Param("action") ActionEnum action);

    Optional<User> findByVerificationCode(String verificationCode);

    boolean existsByEmail(String email);

    boolean existsByPhoneAndDeletedAtIsNull(String phone);

    boolean existsByPhoneAndDeletedAtIsNullAndIdNot(String phone, Long id);

    @Query("select count(u) from User u where u.deleted = false and u.role.active = true "
            + "and upper(u.role.name) = upper(:roleName)")
    long countActiveUsersByRoleName(@Param("roleName") String roleName);
}
