package vn.phantruongan.backend.cvbuilder.dtos.req;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
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
public class CreateCandidateCvReqDTO {

    @NotBlank(message = "Tiêu đề CV không được để trống")
    private String title;

    private String templateId = "modern-it";

    private CvThemeConfigDTO themeConfig;

    private CvContentDTO content;

    @JsonProperty("isDefault")
    private Boolean isDefault;
}
