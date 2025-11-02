package vn.phantruongan.backend.subscriber.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import vn.phantruongan.backend.common.BaseMapper;
import vn.phantruongan.backend.config.common.GlobalMapperConfig;
import vn.phantruongan.backend.subscriber.dtos.req.skill.CreateSkillReqDTO;
import vn.phantruongan.backend.subscriber.dtos.req.skill.UpdateSkillReqDTO;
import vn.phantruongan.backend.subscriber.dtos.res.SkillResDTO;
import vn.phantruongan.backend.subscriber.entities.Skill;

@Mapper(config = GlobalMapperConfig.class)
public interface SkillMapper extends BaseMapper<SkillResDTO, Skill> {

    Skill toEntity(CreateSkillReqDTO dto);

    SkillResDTO toDto(Skill entity);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDto(UpdateSkillReqDTO dto, @MappingTarget Skill entity);

}
