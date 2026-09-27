package vn.phantruongan.backend.cvbuilder.dtos.req;

import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.cvbuilder.dtos.models.CvContentDTO;
import vn.phantruongan.backend.cvbuilder.dtos.models.CvThemeConfigDTO;

@Getter
@Setter
public class UpdateCandidateCvReqDTO {

    private String title;

    private String templateId;

    private CvThemeConfigDTO themeConfig;

    private CvContentDTO content;

    private String pdfUrl;

    private String thumbnailUrl;

    private Boolean isDefault;
}
