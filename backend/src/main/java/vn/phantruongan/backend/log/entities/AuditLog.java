package vn.phantruongan.backend.log.entities;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.log.enums.AuditActionEnum;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ResourceEnum resource;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AuditActionEnum action;

    @Column(nullable = false)
    private String userEmail;

    @Column(name = "record_id")
    private Long recordId;

    private String description;

    private Instant createdAt = Instant.now();
}
