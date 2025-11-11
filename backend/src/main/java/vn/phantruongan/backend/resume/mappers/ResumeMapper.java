package vn.phantruongan.backend.resume.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import vn.phantruongan.backend.common.BaseMapper;
import vn.phantruongan.backend.config.common.GlobalMapperConfig;
import vn.phantruongan.backend.resume.dtos.req.CreateResumeReqDTO;
import vn.phantruongan.backend.resume.dtos.req.UpdateResumeReqDTO;
import vn.phantruongan.backend.resume.dtos.res.ResumeResDTO;
import vn.phantruongan.backend.resume.entities.Resume;

@Mapper(config = GlobalMapperConfig.class)
public interface ResumeMapper extends BaseMapper<ResumeResDTO, Resume> {

    @Mapping(target = "user.id", source = "userId")
    @Mapping(target = "job.id", source = "jobId")
    Resume toEntity(CreateResumeReqDTO dto);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "job.id", target = "jobId")
    ResumeResDTO toDto(Resume entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user.id", source = "userId")
    @Mapping(target = "job.id", source = "jobId")
    void updateEntityFromDto(UpdateResumeReqDTO dto, @MappingTarget Resume entity);
}
