package vn.phantruongan.backend.resume.dtos.req;

import lombok.Data;
import vn.phantruongan.backend.resume.enums.ResumeEnum;

@Data
public class GetListResumeReqDTO {

    private String candidateName;
    private String email;
    private String phoneNumber;
    private ResumeEnum status;

}
