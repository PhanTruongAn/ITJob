package vn.phantruongan.backend.company.dtos.req;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class UpdateCompanyReqDTO extends CreateCompanyReqDTO {
    @NotNull
    private Long id;

}
