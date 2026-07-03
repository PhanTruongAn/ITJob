package vn.phantruongan.backend.recommendation.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vn.phantruongan.backend.recommendation.repositories.EmailSendHistoryRepository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailSendHistoryCleanupTask {

    private final EmailSendHistoryRepository emailSendHistoryRepository;

    @Value("${email.history.retention-days:180}")
    private int retentionDays;

    /**
     * Runs daily at 02:00 AM to delete EmailSendHistory records older than the retention period.
     * Cron expression configurable via: email.history.cleanup-cron
     */
    @Scheduled(cron = "${email.history.cleanup-cron:0 0 2 * * *}")
    @Transactional
    public void cleanupOldHistory() {
        Instant cutoff = Instant.now().minus(retentionDays, ChronoUnit.DAYS);
        log.info("EmailSendHistory cleanup started. Deleting records older than {} days (before {}).", retentionDays, cutoff);
        emailSendHistoryRepository.deleteByCreatedAtBefore(cutoff);
        log.info("EmailSendHistory cleanup completed.");
    }
}
