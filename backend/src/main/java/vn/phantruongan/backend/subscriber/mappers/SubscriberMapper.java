package vn.phantruongan.backend.subscriber.mappers;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import vn.phantruongan.backend.common.BaseMapper;
import vn.phantruongan.backend.config.common.GlobalMapperConfig;
import vn.phantruongan.backend.subscriber.dtos.res.SkillResDTO;
import vn.phantruongan.backend.subscriber.dtos.res.SubscriberResDTO;
import vn.phantruongan.backend.subscriber.entities.Skill;
import vn.phantruongan.backend.subscriber.entities.Subscriber;
import vn.phantruongan.backend.subscriber.entities.SubscriberSkill;

@Mapper(config = GlobalMapperConfig.class)
public interface SubscriberMapper extends BaseMapper<SubscriberResDTO, Subscriber> {

    @Override
    @Mapping(target = "skills", source = "subscriberSkills", qualifiedByName = "mapSkills")
    SubscriberResDTO toDto(Subscriber entity);

    @Named("mapSkills")
    default List<SkillResDTO> mapSkills(List<SubscriberSkill> subscriberSkills) {
        if (subscriberSkills == null)
            return null;

        return subscriberSkills.stream()
                .map(ss -> {
                    Skill skill = ss.getSkill();
                    SkillResDTO dto = new SkillResDTO();
                    dto.setId(skill.getId());
                    dto.setName(skill.getName());
                    dto.setCategory(skill.getCategory() != null ? skill.getCategory().name() : null);
                    dto.setDescription(skill.getDescription());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
