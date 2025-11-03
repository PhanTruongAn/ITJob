package vn.phantruongan.backend.company.dtos.res;

import java.time.DayOfWeek;
import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.phantruongan.backend.company.enums.CompanyTypeEnum;

@Getter
@Setter
@NoArgsConstructor
public class CompanyResDTO {
    private long id;
    private String name;
    private CompanyTypeEnum companyType;
    private String companySize;
    private String industry;
    private boolean overtime;
    private List<DayOfWeek> workingDays;
    private CountryResDTO country;
    private String description;
    private String address;
    private String logo;
}
