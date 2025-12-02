package vn.phantruongan.backend.authorization.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import vn.phantruongan.backend.authorization.dtos.req.permission.CreatePermissionReqDTO;
import vn.phantruongan.backend.authorization.dtos.req.permission.UpdatePermissionReqDTO;
import vn.phantruongan.backend.authorization.dtos.res.PermissionResDTO;
import vn.phantruongan.backend.authorization.entities.Permission;
import vn.phantruongan.backend.common.BaseMapper;
import vn.phantruongan.backend.config.common.GlobalMapperConfig;

@Mapper(config = GlobalMapperConfig.class)
public interface PermissionMapper extends BaseMapper<PermissionResDTO, Permission> {

    Permission toEntity(CreatePermissionReqDTO dto);

    PermissionResDTO toDto(Permission entity);

    List<PermissionResDTO> toDtoList(List<Permission> entities);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDto(UpdatePermissionReqDTO dto, @MappingTarget Permission entity);
}