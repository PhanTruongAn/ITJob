package vn.phantruongan.backend.domain.authorization.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.domain.authorization.enums.MethodEnum;
import vn.phantruongan.backend.domain.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.domain.common.Auditable;

@Entity
@Table(name = "permissions")
@Getter
@Setter
public class Permission extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tên quyền hạn không được để trống!")
    private String name;

    @NotBlank(message = "ApiPath không được để trống!")
    private String apiPath;

    // Method của API: GET, POST, PUT, DELETE...
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MethodEnum method;

    // Action: CREATE, READ, UPDATE, DELETE, APPLY...
    @NotBlank(message = "Action không được để trống!")
    private String action;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceEnum resource;

    @JsonIgnore
    @OneToMany(mappedBy = "permission", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RolePermission> rolePermissions;

}
