package vn.phantruongan.backend.review.dtos.req;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCompanyReviewReqDTO {
    @NotNull(message = "Review ID must not be null")
    private Long id;

    private Integer rating;
    private String comment;
    private Boolean hidden;
}

