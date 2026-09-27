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
public class CvPersonalInfoDto {

    private String fullName;
    private String jobTitle;
    private String email;
    private String phone;
    private String address;
    private String avatarUrl;
    private String github;
    private String linkedin;
    private String portfolio;
}
