package vn.phantruongan.backend.cvbuilder.mappers;

import org.mapstruct.*;
import vn.phantruongan.backend.common.BaseMapper;
import vn.phantruongan.backend.cvbuilder.dtos.res.CandidateCvResDTO;
import vn.phantruongan.backend.cvbuilder.entities.CandidateCv;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CandidateCvMapper extends BaseMapper<CandidateCvResDTO, CandidateCv> {

    @Override
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "themeConfig", expression = "java(entity.getThemeConfig())")
    @Mapping(target = "content", expression = "java(entity.getContent())")
    CandidateCvResDTO toDto(CandidateCv entity);

    /**
     * Not used via BaseMapper for creation flow.
     * Entity creation is handled manually in Service.
     */
    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "themeConfigJson", ignore = true)
    @Mapping(target = "contentJson", ignore = true)
    CandidateCv toEntity(CandidateCvResDTO dto);
}
