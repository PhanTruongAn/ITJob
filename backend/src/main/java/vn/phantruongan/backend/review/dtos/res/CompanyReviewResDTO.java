package vn.phantruongan.backend.review.dtos.res;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyReviewResDTO {
    private Long id;
    private String userName;
    private Integer rating;
    private String comment;
    private boolean hidden;
}
