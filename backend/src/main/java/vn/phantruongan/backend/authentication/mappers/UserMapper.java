package vn.phantruongan.backend.authentication.mappers;

import org.mapstruct.Mapper;
import org.springframework.boot.autoconfigure.security.SecurityProperties.User;

import vn.phantruongan.backend.authentication.dtos.res.ResUserDTO;
import vn.phantruongan.backend.common.BaseMapper;
import vn.phantruongan.backend.config.common.GlobalMapperConfig;

@Mapper(config = GlobalMapperConfig.class)
public interface UserMapper extends BaseMapper<ResUserDTO, User> {
    User toEntity(ResUserDTO dto);
}
