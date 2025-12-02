package vn.phantruongan.backend.bookmark.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import vn.phantruongan.backend.bookmark.dtos.res.SavedCompanyResDTO;
import vn.phantruongan.backend.bookmark.entities.SavedCompany;
import vn.phantruongan.backend.common.BaseMapper;
import vn.phantruongan.backend.company.mappers.CompanyMapper;
import vn.phantruongan.backend.config.common.GlobalMapperConfig;

@Mapper(config = GlobalMapperConfig.class, uses = { CompanyMapper.class })
public interface SavedCompanyMapper extends BaseMapper<SavedCompanyResDTO, SavedCompany> {
    @Override
    @Mapping(source = "company", target = "company")
    SavedCompanyResDTO toDto(SavedCompany entity);

    List<SavedCompanyResDTO> toDtoList(List<SavedCompany> dtoList);
}
