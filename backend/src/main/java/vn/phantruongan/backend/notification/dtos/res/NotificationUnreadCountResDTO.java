package vn.phantruongan.backend.notification.dtos.res;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationUnreadCountResDTO {
    private long count;
}
