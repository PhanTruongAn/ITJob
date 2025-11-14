package vn.phantruongan.backend.company.dtos.req;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.phantruongan.backend.company.entities.CompanyStatus;
import vn.phantruongan.backend.company.enums.CompanyTypeEnum;

@Getter
@Setter
@NoArgsConstructor
public class GetListCompanyReqDTO {
    private String name;
    private String address;
    private CompanyTypeEnum companyType;
    private String companySize;
    private CompanyStatus status;
    private Long countryId;
}
