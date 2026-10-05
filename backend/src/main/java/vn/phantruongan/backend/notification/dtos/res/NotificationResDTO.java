package vn.phantruongan.backend.notification.dtos.res;

import java.time.Instant;

import lombok.Builder;
import lombok.Value;
import vn.phantruongan.backend.notification.enums.NotificationType;
import vn.phantruongan.backend.resume.enums.ResumeEnum;

@Value
@Builder
public class NotificationResDTO {
    Long id;
    NotificationType type;
    ResumeEnum applicationStatus;
    Long relatedResumeId;
    Long jobId;
    String jobTitle;
    boolean read;
    Instant createdAt;
}
