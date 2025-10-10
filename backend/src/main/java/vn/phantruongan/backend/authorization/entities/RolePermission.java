package vn.phantruongan.backend.authorization.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.common.Auditable;

@Entity
@Table(name = "role_permissions")
@Getter
@Setter
public class RolePermission extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne()
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @ManyToOne()
    @JoinColumn(name = "permission_id", nullable = false)
    private Permission permission;

}