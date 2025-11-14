package vn.phantruongan.backend.company.dtos.req;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import vn.phantruongan.backend.company.entities.CompanyStatus;

@Data
@EqualsAndHashCode(callSuper = true)
public class UpdateCompanyReqDTO extends CreateCompanyReqDTO {
    @NotNull
    private Long id;

    @NotNull
    private CompanyStatus status;
}
