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
public class CvThemeConfigDTO {

    private String primaryColor;
    private String fontFamily;
    private String fontSize;
    private String sectionSpacing;
    private List<String> sectionOrder;
}
