package vn.phantruongan.backend.bookmark.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import vn.phantruongan.backend.bookmark.dtos.res.SavedJobResDTO;
import vn.phantruongan.backend.bookmark.entities.SavedJob;
import vn.phantruongan.backend.common.BaseMapper;
import vn.phantruongan.backend.config.common.GlobalMapperConfig;
import vn.phantruongan.backend.job.mappers.JobMapper;

@Mapper(config = GlobalMapperConfig.class, uses = { JobMapper.class })
public interface SavedJobMapper extends BaseMapper<SavedJobResDTO, SavedJob> {

    @Override
    @Mapping(source = "job", target = "job")
    SavedJobResDTO toDto(SavedJob entity);

    List<SavedJobResDTO> toDtoList(List<SavedJob> entities);

}
