package vn.phantruongan.backend.company.dtos.req;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import vn.phantruongan.backend.company.entities.CompanyStatus;

@Data
@EqualsAndHashCode(callSuper = true)
public class UpdateCompanyReqDTO extends CreateCompanyReqDTO {
    @NotNull(message = "Company ID must not be null")
    private Long id;

    private CompanyStatus status;
}
