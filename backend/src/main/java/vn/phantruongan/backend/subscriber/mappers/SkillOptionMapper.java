package vn.phantruongan.backend.subscriber.mappers;

import java.util.List;

import org.mapstruct.Mapper;

import vn.phantruongan.backend.config.common.GlobalMapperConfig;
import vn.phantruongan.backend.subscriber.dtos.res.SkillOptionResDTO;
import vn.phantruongan.backend.subscriber.projection.SkillOptionProjection;

@Mapper(config = GlobalMapperConfig.class)
public interface SkillOptionMapper {

    SkillOptionResDTO toDto(SkillOptionProjection projection);

    List<SkillOptionResDTO> toDtoList(List<SkillOptionProjection> projections);
}
