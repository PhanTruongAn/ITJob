package vn.phantruongan.backend.log.services;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.log.entities.AuditLog;
import vn.phantruongan.backend.log.enums.AuditActionEnum;
import vn.phantruongan.backend.log.repositories.AuditLogRepository;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    // Single log
    public AuditLog logCreate(ResourceEnum resource, String email, long recordId, String description) {
        return log(AuditActionEnum.CREATE, resource, email, recordId, description);
    }

    public AuditLog logUpdate(ResourceEnum resource, String email, long recordId, String description) {
        return log(AuditActionEnum.UPDATE, resource, email, recordId, description);
    }

    public AuditLog logDelete(ResourceEnum resource, String email, long recordId, String description) {
        return log(AuditActionEnum.DELETE, resource, email, recordId, description);
    }

    public AuditLog logApprove(ResourceEnum resource, String email, long recordId, String description) {
        return log(AuditActionEnum.APPROVE, resource, email, recordId, description);
    }

    public AuditLog logReview(ResourceEnum resource, String email, long recordId, String description) {
        return log(AuditActionEnum.REVIEW, resource, email, recordId, description);
    }

    public AuditLog logReject(ResourceEnum resource, String email, long recordId, String description) {
        return log(AuditActionEnum.REJECT, resource, email, recordId, description);
    }

    // Batch log
    public List<AuditLog> logBatch(AuditActionEnum action, ResourceEnum resource, List<AuditLog> logs) {
        logs.forEach(l -> l.setAction(action));
        return auditLogRepository.saveAll(logs);
    }

    private AuditLog log(AuditActionEnum action, ResourceEnum resource, String email, long recordId,
            String description) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setResource(resource);
        log.setUserEmail(email);
        log.setRecordId(recordId);
        log.setDescription(description);
        log.setCreatedAt(Instant.now());

        return auditLogRepository.save(log);
    }
}