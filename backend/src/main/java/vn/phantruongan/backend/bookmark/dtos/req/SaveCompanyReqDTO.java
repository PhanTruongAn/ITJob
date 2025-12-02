package vn.phantruongan.backend.bookmark.dtos.req;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SaveCompanyReqDTO {
    @NotNull(message = "CompanyId must not be null")
    private Long companyId;
}
