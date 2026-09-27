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
public class CvExperienceDto {

    private String id;
    private String company;
    private String position;
    private String location;
    private String startDate;
    private String endDate;
    private boolean isCurrent;
    private String description;
    private List<String> technologies;
}
