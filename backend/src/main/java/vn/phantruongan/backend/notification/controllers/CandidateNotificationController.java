package vn.phantruongan.backend.notification.controllers;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.notification.dtos.res.NotificationResDTO;
import vn.phantruongan.backend.notification.dtos.res.NotificationUnreadCountResDTO;
import vn.phantruongan.backend.notification.services.NotificationService;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.annotations.RequirePermission;
import vn.phantruongan.backend.util.error.InvalidException;

@RestController
@RequestMapping(ApiPaths.CANDIDATE_NOTIFICATIONS)
@RequiredArgsConstructor
public class CandidateNotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @RequirePermission(resource = ResourceEnum.NOTIFICATION, action = ActionEnum.READ)
    @ApiMessage("Get candidate notifications")
    public ResponseEntity<PaginationResponse<NotificationResDTO>> getMyNotifications(
            @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(notificationService.getMyNotifications(pageable));
    }

    @GetMapping("/unread-count")
    @RequirePermission(resource = ResourceEnum.NOTIFICATION, action = ActionEnum.READ)
    @ApiMessage("Get candidate unread notification count")
    public ResponseEntity<NotificationUnreadCountResDTO> getUnreadCount() {
        return ResponseEntity.ok(notificationService.getMyUnreadCount());
    }

    @PatchMapping("/{id}/read")
    @RequirePermission(resource = ResourceEnum.NOTIFICATION, action = ActionEnum.UPDATE)
    @ApiMessage("Mark notification as read")
    public ResponseEntity<Boolean> markAsRead(@PathVariable long id) throws InvalidException {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(true);
    }

    @PatchMapping("/read-all")
    @RequirePermission(resource = ResourceEnum.NOTIFICATION, action = ActionEnum.UPDATE)
    @ApiMessage("Mark candidate notifications as read")
    public ResponseEntity<Integer> markAllAsRead() {
        return ResponseEntity.ok(notificationService.markAllAsRead());
    }
}
