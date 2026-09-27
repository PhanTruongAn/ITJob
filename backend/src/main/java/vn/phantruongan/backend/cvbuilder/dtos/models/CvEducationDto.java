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
public class CvEducationDto {

    private String id;
    private String school;
    private String degree;
    private String field;
    private String startDate;
    private String endDate;
    private String gpa;
    private String description;
}
