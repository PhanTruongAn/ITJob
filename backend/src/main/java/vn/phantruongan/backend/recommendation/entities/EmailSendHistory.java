package vn.phantruongan.backend.recommendation.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.phantruongan.backend.recommendation.enums.EmailStatus;

import java.time.Instant;

@Entity
@Table(name = "email_send_history", indexes = {
        @Index(name = "idx_esh_recommendation_id", columnList = "recommendation_id"),
        @Index(name = "idx_esh_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailSendHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recommendation_id", nullable = false)
    private Long recommendationId;

    @Column(nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmailStatus status;

    @Column(nullable = false)
    private int attempt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;
}
