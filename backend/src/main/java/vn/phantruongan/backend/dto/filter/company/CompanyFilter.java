package vn.phantruongan.backend.dto.filter.company;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.util.enums.CompanyType;

@Getter
@Setter
@AllArgsConstructor
public class CompanyFilter {
    private String name;
    private String address;
    private CompanyType companyType;
    private String companySize;
    private Long countryId;
}
