package vn.phantruongan.backend.cvbuilder.dtos.models;

import java.util.List;

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
public class CvContentDTO {

    private CvPersonalInfoDto personalInfo;
    private String summary;
    private List<CvSkillGroupDto> skills;
    private List<CvExperienceDto> experience;
    private List<CvProjectDto> projects;
    private List<CvEducationDto> education;
    private List<CvCertificateDto> certificates;
}
