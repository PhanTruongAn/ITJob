package vn.phantruongan.backend.cvbuilder.dtos.req;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.phantruongan.backend.cvbuilder.dtos.models.CvContentDTO;
import vn.phantruongan.backend.cvbuilder.dtos.models.CvThemeConfigDTO;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCandidateCvReqDTO {

    private String title;

    private String templateId;

    private CvThemeConfigDTO themeConfig;

    private CvContentDTO content;

    private String pdfUrl;

    private String thumbnailUrl;

    @JsonProperty("isDefault")
    private Boolean isDefault;
}
