package vn.phantruongan.backend.recommendation.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.phantruongan.backend.recommendation.entities.EmailSendHistory;
import vn.phantruongan.backend.recommendation.enums.EmailStatus;
import vn.phantruongan.backend.recommendation.repositories.EmailSendHistoryRepository;

import vn.phantruongan.backend.util.annotations.RequirePermission;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/email/analytics")
@RequiredArgsConstructor
@Slf4j
public class EmailAnalyticsController {

    private final EmailSendHistoryRepository emailSendHistoryRepository;

    /**
     * GET /api/v1/admin/email/analytics/summary
     * Returns aggregated counts grouped by status for a given date range.
     *
     * @param from  start date (inclusive), default 30 days ago
     * @param to    end date (inclusive), default today
     * @param format response format: "json" (default) or "csv"
     */
    @RequirePermission(resource = ResourceEnum.STATISTICS, action = ActionEnum.READ)
    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(defaultValue = "json") String format) {

        Instant start = from != null ? from.atStartOfDay().toInstant(ZoneOffset.UTC)
                : Instant.now().minusSeconds(30L * 24 * 3600);
        Instant end = to != null ? to.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC) : Instant.now();

        long totalSent    = emailSendHistoryRepository.countByStatusAndCreatedAtBetween(EmailStatus.SENT, start, end);
        long totalFailed  = emailSendHistoryRepository.countByStatusAndCreatedAtBetween(EmailStatus.FAILED, start, end);
        long totalPending = emailSendHistoryRepository.countByStatusAndCreatedAtBetween(EmailStatus.PENDING, start, end);
        long grandTotal   = totalSent + totalFailed + totalPending;

        if ("csv".equalsIgnoreCase(format)) {
            String csv = "status,count\n" +
                    "SENT," + totalSent + "\n" +
                    "FAILED," + totalFailed + "\n" +
                    "PENDING," + totalPending + "\n" +
                    "TOTAL," + grandTotal + "\n";
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"email_analytics_summary.csv\"")
                    .contentType(MediaType.parseMediaType("text/csv"))
                    .body(csv);
        }

        Map<String, Object> result = Map.of(
                "from", start.toString(),
                "to", end.toString(),
                "sent", totalSent,
                "failed", totalFailed,
                "pending", totalPending,
                "total", grandTotal
        );
        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/v1/admin/email/analytics/records
     * Returns raw EmailSendHistory records for a given date range.
     *
     * @param from   start date (inclusive)
     * @param to     end date (inclusive)
     * @param format "json" (default) or "csv"
     */
    @RequirePermission(resource = ResourceEnum.STATISTICS, action = ActionEnum.READ)
    @GetMapping("/records")
    public ResponseEntity<?> getRecords(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(defaultValue = "json") String format) {

        Instant start = from != null ? from.atStartOfDay().toInstant(ZoneOffset.UTC)
                : Instant.now().minusSeconds(30L * 24 * 3600);
        Instant end = to != null ? to.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC) : Instant.now();

        List<EmailSendHistory> records = emailSendHistoryRepository.findByCreatedAtBetween(start, end);

        if ("csv".equalsIgnoreCase(format)) {
            StringBuilder sb = new StringBuilder("id,recommendation_id,email,status,attempt,created_at,error_message\n");
            for (EmailSendHistory r : records) {
                sb.append(r.getId()).append(",")
                        .append(r.getRecommendationId()).append(",")
                        .append(r.getEmail()).append(",")
                        .append(r.getStatus()).append(",")
                        .append(r.getAttempt()).append(",")
                        .append(r.getCreatedAt()).append(",")
                        .append(r.getErrorMessage() != null ? "\"" + r.getErrorMessage().replace("\"", "'") + "\"" : "")
                        .append("\n");
            }
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"email_analytics_records.csv\"")
                    .contentType(MediaType.parseMediaType("text/csv"))
                    .body(sb.toString());
        }

        return ResponseEntity.ok(records);
    }
}
