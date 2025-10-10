package vn.phantruongan.backend.company.dtos.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.company.enums.CompanyTypeEnum;

@Getter
@Setter
@AllArgsConstructor
public class CompanyFilterDTO {
    private String name;
    private String address;
    private CompanyTypeEnum companyType;
    private String companySize;
    private Long countryId;
}
