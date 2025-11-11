package vn.phantruongan.backend.resume.dtos.req;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.phantruongan.backend.resume.enums.ResumeEnum;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateResumeReqDTO {

    @NotBlank(message = "Candidate name must not be blank")
    private String candidateName;

    @NotBlank(message = "Phone number must not be blank")
    private String phoneNumber;

    @Email(message = "Email must be valid")
    @NotBlank(message = "Email must not be blank")
    private String email;

    private String url;

    @NotNull(message = "Resume status must not be null")
    private ResumeEnum status;

    @NotNull(message = "User ID must not be null")
    private Long userId;

    @NotNull(message = "Job ID must not be null")
    private Long jobId;
}
