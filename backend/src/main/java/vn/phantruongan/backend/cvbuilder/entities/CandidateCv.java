package vn.phantruongan.backend.cvbuilder.entities;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.*;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.common.Auditable;
import vn.phantruongan.backend.cvbuilder.dtos.models.CvContentDTO;
import vn.phantruongan.backend.cvbuilder.dtos.models.CvThemeConfigDTO;

@Entity
@Table(name = "candidate_cvs", indexes = {
        @Index(name = "idx_candidate_cv_user_id", columnList = "user_id"),
        @Index(name = "idx_candidate_cv_is_default", columnList = "is_default")
})
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class CandidateCv extends Auditable {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "template_id", length = 50)
    private String templateId = "modern-it";

    // Stored as JSON TEXT in PostgreSQL
    @Column(name = "theme_config", columnDefinition = "TEXT")
    private String themeConfigJson;

    @Column(columnDefinition = "TEXT")
    private String contentJson;

    @Column(name = "pdf_url")
    private String pdfUrl;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "is_default", nullable = false)
    private boolean isDefault = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private User user;

    // ─── Convenience Helpers: Serialize / Deserialize ───────────────────────

    @Transient
    public CvThemeConfigDTO getThemeConfig() {
        if (themeConfigJson == null || themeConfigJson.isBlank()) return null;
        try {
            return MAPPER.readValue(themeConfigJson, CvThemeConfigDTO.class);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    @Transient
    public void setThemeConfig(CvThemeConfigDTO dto) {
        if (dto == null) {
            this.themeConfigJson = null;
            return;
        }
        try {
            this.themeConfigJson = MAPPER.writeValueAsString(dto);
        } catch (JsonProcessingException e) {
            this.themeConfigJson = null;
        }
    }

    @Transient
    public CvContentDTO getContent() {
        if (contentJson == null || contentJson.isBlank()) return null;
        try {
            return MAPPER.readValue(contentJson, CvContentDTO.class);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    @Transient
    public void setContent(CvContentDTO dto) {
        if (dto == null) {
            this.contentJson = null;
            return;
        }
        try {
            this.contentJson = MAPPER.writeValueAsString(dto);
        } catch (JsonProcessingException e) {
            this.contentJson = null;
        }
    }
}
