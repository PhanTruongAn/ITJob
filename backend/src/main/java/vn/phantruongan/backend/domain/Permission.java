package vn.phantruongan.backend.domain;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.util.enums.MethodEnum;

@Entity
@Table(name = "permissions")
@Getter
@Setter
public class Permission extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @NotBlank(message = "Tên quyền hạn không được để trống!")
    private String name;
    @NotBlank(message = "ApiPath không được để trống!")
    private String apiPath;
    @NotBlank(message = "Phương thức không được để trống!")
    @Enumerated(EnumType.STRING)
    private MethodEnum method;
    @NotBlank(message = "Module không được để trống!")
    private String module;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "permissions")
    private List<Role> roles;

}
