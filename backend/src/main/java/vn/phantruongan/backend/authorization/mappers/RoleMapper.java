package vn.phantruongan.backend.authorization.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import vn.phantruongan.backend.authorization.dtos.req.role.CreateRoleReqDTO;
import vn.phantruongan.backend.authorization.dtos.req.role.UpdateRoleReqDTO;
import vn.phantruongan.backend.authorization.dtos.res.RoleResDTO;
import vn.phantruongan.backend.authorization.entities.Role;
import vn.phantruongan.backend.common.BaseMapper;
import vn.phantruongan.backend.config.common.GlobalMapperConfig;

@Mapper(config = GlobalMapperConfig.class)
public interface RoleMapper extends BaseMapper<RoleResDTO, Role> {

    Role toEntity(CreateRoleReqDTO dto);

    RoleResDTO toDto(Role entity);

    List<RoleResDTO> toDtoList(List<Role> entities);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDto(UpdateRoleReqDTO dto, @MappingTarget Role entity);
}
