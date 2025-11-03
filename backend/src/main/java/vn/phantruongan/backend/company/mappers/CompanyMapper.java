package vn.phantruongan.backend.company.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import vn.phantruongan.backend.common.BaseMapper;
import vn.phantruongan.backend.company.dtos.req.CreateCompanyReqDTO;
import vn.phantruongan.backend.company.dtos.req.UpdateCompanyReqDTO;
import vn.phantruongan.backend.company.dtos.res.CompanyResDTO;
import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.config.common.GlobalMapperConfig;

@Mapper(config = GlobalMapperConfig.class, uses = { CountryMapper.class })
public interface CompanyMapper extends BaseMapper<CompanyResDTO, Company> {

    Company toEntity(CreateCompanyReqDTO dto);

    CompanyResDTO toDto(Company entity);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDto(UpdateCompanyReqDTO dto, @MappingTarget Company entity);
}