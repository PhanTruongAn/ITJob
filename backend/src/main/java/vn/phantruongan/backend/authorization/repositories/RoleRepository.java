package vn.phantruongan.backend.authorization.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;

import vn.phantruongan.backend.authorization.entities.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long>, JpaSpecificationExecutor<Role> {
    public Optional<Role> findByName(String name);

    public boolean existsByName(String name);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select r from Role r where upper(r.name) = upper(:name)")
    Optional<Role> findByNameForUpdate(@Param("name") String name);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select r from Role r where r.id = :id")
    Optional<Role> findByIdForUpdate(@Param("id") long id);
}
