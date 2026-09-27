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
public class CvProjectDto {

    private String id;
    private String name;
    private String role;
    private String demoUrl;
    private String repoUrl;
    private String startDate;
    private String endDate;
    private String description;
    private List<String> technologies;
}
