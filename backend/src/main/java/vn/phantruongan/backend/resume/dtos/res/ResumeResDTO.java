package vn.phantruongan.backend.resume.dtos.res;

import lombok.Data;
import lombok.NoArgsConstructor;
import vn.phantruongan.backend.resume.enums.ResumeEnum;

@Data
@NoArgsConstructor
public class ResumeResDTO {
    private long id;
    private String candidateName;
    private String phoneNumber;
    private String note;
    private String email;
    private String url;
    private ResumeEnum status;
    private Long userId;
    private Long jobId;
}
