package vn.phantruongan.backend.job.dtos.req.job;

import java.time.Instant;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.phantruongan.backend.job.enums.LevelEnum;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateJobReqDTO {

    @NotBlank(message = "Job name must not be blank")
    private String name;

    private String location;

    @NotBlank(message = "Job description must not be blank")
    private String description;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;

    @NotNull(message = "Salary must not be null")
    @Positive(message = "Salary must be greater than 0")
    private Double salary;

    @NotNull(message = "Job level must not be null")
    private LevelEnum level;

    @NotNull(message = "Start date must not be null")
    private Instant startDate;

    @NotNull(message = "End date must not be null")
    private Instant endDate;

    private boolean active;

    @NotNull(message = "Company ID must not be null")
    private long companyId;

    @NotEmpty(message = "At least one skill must be provided")
    @Size(min = 1, message = "At least one skill must be provided")
    @Valid
    private List<Long> skillIds;
}
