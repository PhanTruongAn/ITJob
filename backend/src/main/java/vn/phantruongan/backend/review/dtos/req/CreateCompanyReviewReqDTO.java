package vn.phantruongan.backend.review.dtos.req;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCompanyReviewReqDTO {
    @NotNull(message = "Company ID must not be null")
    private Long companyId;

    @NotNull(message = "User ID must not be null")
    private Long userId;

    @NotNull(message = "Rating must not be null")
    @Min(value = 1, message = "Rating must be from 1 to 5")
    private Integer rating;

    @NotBlank(message = "Comment must not be blank")
    private String comment;
}
