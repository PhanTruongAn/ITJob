package vn.phantruongan.backend.review.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import vn.phantruongan.backend.config.common.GlobalMapperConfig;
import vn.phantruongan.backend.review.dtos.req.CreateCompanyReviewReqDTO;
import vn.phantruongan.backend.review.dtos.req.UpdateCompanyReviewReqDTO;
import vn.phantruongan.backend.review.dtos.res.CompanyReviewResDTO;
import vn.phantruongan.backend.review.entities.CompanyReview;

@Mapper(config = GlobalMapperConfig.class)
public interface CompanyReviewMapper {

    CompanyReview toEntity(CreateCompanyReviewReqDTO dto);

    @Mapping(source = "user.name", target = "userName")
    CompanyReviewResDTO toDto(CompanyReview entity);

    List<CompanyReviewResDTO> toDtoList(List<CompanyReview> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "company", ignore = true)
    @Mapping(target = "user", ignore = true)
    void updateEntityFromDto(UpdateCompanyReviewReqDTO dto,
            @MappingTarget CompanyReview entity);
}
