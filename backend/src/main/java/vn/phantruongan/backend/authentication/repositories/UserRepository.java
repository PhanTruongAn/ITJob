package vn.phantruongan.backend.authentication.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.authentication.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findByGoogleId(String googleId);

    Optional<User> findByEmail(String email);

    Optional<User> findByVerificationCode(String verificationCode);

    boolean existsByEmail(String email);

    boolean existsByPhoneAndDeletedAtIsNull(String phone);

    boolean existsByPhoneAndDeletedAtIsNullAndIdNot(String phone, Long id);

    @Query("select count(u) from User u where u.deleted = false and u.role.active = true "
            + "and upper(u.role.name) = upper(:roleName)")
    long countActiveUsersByRoleName(@Param("roleName") String roleName);
}
