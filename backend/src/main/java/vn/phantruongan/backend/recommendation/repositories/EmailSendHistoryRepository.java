package vn.phantruongan.backend.recommendation.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.phantruongan.backend.recommendation.entities.EmailSendHistory;
import vn.phantruongan.backend.recommendation.enums.EmailStatus;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Repository
public interface EmailSendHistoryRepository extends JpaRepository<EmailSendHistory, Long> {

    List<EmailSendHistory> findByCreatedAtAfter(Instant after);

    List<EmailSendHistory> findByCreatedAtBetween(Instant start, Instant end);

    void deleteByCreatedAtBefore(Instant cutoff);

    long countByStatus(EmailStatus status);

    long countByStatusAndCreatedAtBetween(EmailStatus status, Instant start, Instant end);

    @Query("""
            SELECT e.status AS status, COUNT(e) AS total
            FROM EmailSendHistory e
            WHERE e.createdAt BETWEEN :start AND :end
            GROUP BY e.status
            """)
    List<Map<String, Object>> countGroupedByStatusBetween(Instant start, Instant end);
}
