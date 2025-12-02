package vn.phantruongan.backend.job.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import vn.phantruongan.backend.common.BaseMapper;
import vn.phantruongan.backend.config.common.GlobalMapperConfig;
import vn.phantruongan.backend.job.dtos.req.job.CreateJobReqDTO;
import vn.phantruongan.backend.job.dtos.req.job.UpdateJobReqDTO;
import vn.phantruongan.backend.job.dtos.res.JobResDTO;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.subscriber.mappers.SkillMapper;

@Mapper(config = GlobalMapperConfig.class, uses = { JobSkillMapper.class, SkillMapper.class })
public interface JobMapper extends BaseMapper<JobResDTO, Job> {

    @Mapping(target = "company.id", source = "companyId")
    Job toEntity(CreateJobReqDTO dto);

    @Mapping(source = "company.id", target = "companyId")
    JobResDTO toDto(Job entity);

    List<JobResDTO> toDtoList(List<Job> entities);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDto(UpdateJobReqDTO dto, @MappingTarget Job entity);
}
