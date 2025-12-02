package vn.phantruongan.backend.bookmark.dtos.req;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SaveJobReqDTO {
    @NotNull(message = "JobId must not be null")
    private Long jobId;
}
