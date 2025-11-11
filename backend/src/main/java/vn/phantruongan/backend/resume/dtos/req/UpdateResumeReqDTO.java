package vn.phantruongan.backend.resume.dtos.req;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class UpdateResumeReqDTO extends CreateResumeReqDTO {
    private long id;
}
