package vn.phantruongan.backend.company.dtos.req;

import java.time.DayOfWeek;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.phantruongan.backend.company.enums.CompanyTypeEnum;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCompanyReqDTO {

    @NotBlank(message = "Company name cannot be null or empty")
    private String name;

    @NotNull(message = "Country id cannot be null")
    private Long countryId;

    private String industry;

    @NotNull(message = "Company type cannot be null")
    private CompanyTypeEnum companyType;

    private String companySize;

    private boolean overtime;

    private List<DayOfWeek> workingDays;

    private String description;

    private String address;

    private String logo;
}