package vn.phantruongan.backend.review.dtos.req;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
public class UpdateCompanyReviewReqDTO extends CreateCompanyReviewReqDTO {
    @NotNull(message = "Review ID must not be null")
    private Long id;

    @NotNull(message = "Rating must not be null")
    @Min(value = 1, message = "Rating must be from 1 to 5")
    private Integer rating;

    @NotBlank(message = "Review ID must not be null")
    private String comment;
    private boolean hidden;
}
