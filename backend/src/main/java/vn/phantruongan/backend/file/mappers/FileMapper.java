package vn.phantruongan.backend.file.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import vn.phantruongan.backend.common.BaseMapper;
import vn.phantruongan.backend.file.dtos.res.FileResDTO;
import vn.phantruongan.backend.file.entities.File;

@Mapper(componentModel = "spring")
public interface FileMapper extends BaseMapper<FileResDTO, File> {
    @Override
    @Mapping(target = "isDefault", source = "default")
    FileResDTO toDto(File entity);

    @Override
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "user", ignore = true)
    File toEntity(FileResDTO dto);
}

