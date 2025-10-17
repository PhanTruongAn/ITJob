package vn.phantruongan.backend.authentication.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import vn.phantruongan.backend.authentication.dtos.req.CreateUserReqDTO;
import vn.phantruongan.backend.authentication.dtos.req.UpdateUserReqDTO;
import vn.phantruongan.backend.authentication.dtos.res.UserResDTO;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.common.BaseMapper;
import vn.phantruongan.backend.config.common.GlobalMapperConfig;

@Mapper(config = GlobalMapperConfig.class)
public interface UserMapper extends BaseMapper<UserResDTO, User> {
    User toEntity(CreateUserReqDTO dto);

    UserResDTO toDto(User entity);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDto(UpdateUserReqDTO dto, @MappingTarget User entity);
}
