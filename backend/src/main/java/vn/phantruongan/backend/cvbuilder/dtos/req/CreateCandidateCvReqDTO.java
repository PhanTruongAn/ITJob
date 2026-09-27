package vn.phantruongan.backend.cvbuilder.dtos.req;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.cvbuilder.dtos.models.CvContentDTO;
import vn.phantruongan.backend.cvbuilder.dtos.models.CvThemeConfigDTO;

@Getter
@Setter
public class CreateCandidateCvReqDTO {

    @NotBlank(message = "Tên CV không được để trống")
    private String title;

    private String templateId;

    private CvThemeConfigDTO themeConfig;

    private CvContentDTO content;

    private Boolean isDefault = false;
}
