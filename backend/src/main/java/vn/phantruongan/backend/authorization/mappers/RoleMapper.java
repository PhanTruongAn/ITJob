package vn.phantruongan.backend.authorization.mappers;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import vn.phantruongan.backend.authorization.dtos.req.role.CreateRoleReqDTO;
import vn.phantruongan.backend.authorization.dtos.req.role.UpdateRoleReqDTO;
import vn.phantruongan.backend.authorization.dtos.res.PermissionResDTO;
import vn.phantruongan.backend.authorization.dtos.res.RoleDetailResDTO;
import vn.phantruongan.backend.authorization.dtos.res.RoleResDTO;
import vn.phantruongan.backend.authorization.entities.Permission;
import vn.phantruongan.backend.authorization.entities.Role;
import vn.phantruongan.backend.authorization.entities.RolePermission;
import vn.phantruongan.backend.common.BaseMapper;
import vn.phantruongan.backend.config.common.GlobalMapperConfig;

@Mapper(config = GlobalMapperConfig.class)
public interface RoleMapper extends BaseMapper<RoleResDTO, Role> {

    Role toEntity(CreateRoleReqDTO dto);

    // RoleResDTO toDto(Role entity);

    @Named("roleToDto")
    RoleResDTO toDto(Role entity);

    @Override
    @IterableMapping(qualifiedByName = "roleToDto")
    List<RoleResDTO> toDtoList(List<Role> entities);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDto(UpdateRoleReqDTO dto, @MappingTarget Role entity);

    default RoleDetailResDTO toDetailDto(Role entity) {
        if (entity == null) {
            return null;
        }
        RoleDetailResDTO dto = new RoleDetailResDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setActive(entity.isActive());

        if (entity.getRolePermissions() != null) {
            List<PermissionResDTO> perms = entity.getRolePermissions().stream()
                    .map(RolePermission::getPermission)
                    .map(this::permissionToDto)
                    .collect(Collectors.toList());
            dto.setPermissions(perms);
        }
        return dto;
    }

    default PermissionResDTO permissionToDto(Permission permission) {
        if (permission == null) {
            return null;
        }
        PermissionResDTO dto = new PermissionResDTO();
        dto.setId(permission.getId());
        dto.setName(permission.getName());
        dto.setApiPath(permission.getApiPath());
        dto.setMethod(permission.getMethod());
        dto.setAction(permission.getAction());
        dto.setResource(permission.getResource());
        return dto;
    }
}
