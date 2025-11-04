package vn.phantruongan.backend.job.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import vn.phantruongan.backend.common.BaseMapper;
import vn.phantruongan.backend.config.common.GlobalMapperConfig;
import vn.phantruongan.backend.job.dtos.req.jobSkill.CreateJobSkillReqDTO;
import vn.phantruongan.backend.job.dtos.res.JobSkillResDTO;
import vn.phantruongan.backend.job.entities.JobSkill;
import vn.phantruongan.backend.subscriber.mappers.SkillMapper;

@Mapper(config = GlobalMapperConfig.class, uses = { SkillMapper.class })
public interface JobSkillMapper extends BaseMapper<JobSkillResDTO, JobSkill> {

    @Override
    @Mapping(source = "skill", target = "skill")
    JobSkillResDTO toDto(JobSkill entity);

    @Mapping(target = "job", ignore = true)
    @Mapping(target = "skill.id", source = "skillId")
    JobSkill toEntity(CreateJobSkillReqDTO dto);
}
