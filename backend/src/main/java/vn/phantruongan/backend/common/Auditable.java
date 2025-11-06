package vn.phantruongan.backend.common;

import java.time.Instant;

import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.config.jwt.JwtService;

@MappedSuperclass
@Getter
@Setter
public abstract class Auditable {

    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;

    @PrePersist
    public void handleBeforeCreate() {
        try {
            this.createdBy = JwtService.getCurrentUserLogin().orElse("");
        } catch (Exception e) {
            this.createdBy = "system";
        }
        this.createdAt = Instant.now();
    }

    @PreUpdate
    public void handleBeforeUpdate() {
        try {
            this.updatedBy = JwtService.getCurrentUserLogin().orElse("");
        } catch (Exception e) {
            this.updatedBy = "system";
        }
        this.updatedAt = Instant.now();
    }
}
