package vn.phantruongan.backend.notification.dtos.res;

import java.time.Instant;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ManagementReviewNotificationResDTO {
    Long id;
    String type;
    Long companyId;
    String companyName;
    Long jobId;
    String jobTitle;
    String reviewStatus;
    Instant createdAt;
}
