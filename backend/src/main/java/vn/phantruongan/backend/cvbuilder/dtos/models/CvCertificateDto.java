package vn.phantruongan.backend.cvbuilder.dtos.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CvCertificateDto {

    private String id;
    private String name;
    private String organization;
    private String issueDate;
    private String url;
}
