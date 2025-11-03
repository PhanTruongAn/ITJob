package vn.phantruongan.backend.company.mappers;

import org.mapstruct.Mapper;

import vn.phantruongan.backend.company.dtos.res.CountryResDTO;
import vn.phantruongan.backend.company.entities.Country;
import vn.phantruongan.backend.config.common.GlobalMapperConfig;

@Mapper(config = GlobalMapperConfig.class)
public interface CountryMapper {
    CountryResDTO toDto(Country entity);
}
