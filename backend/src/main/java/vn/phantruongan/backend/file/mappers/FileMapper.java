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
}

