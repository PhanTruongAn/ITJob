package vn.phantruongan.backend.company.dtos.req.country;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCountryReqDTO {
    @NotNull(message = "Id is required")
    private Long id;

    @NotBlank(message = "Country code is required")
    private String code;

    @NotBlank(message = "Country name is required")
    private String name;
}
