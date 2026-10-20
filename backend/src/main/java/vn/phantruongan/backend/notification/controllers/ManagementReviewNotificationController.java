package vn.phantruongan.backend.notification.controllers;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.notification.dtos.res.ManagementReviewNotificationResDTO;
import vn.phantruongan.backend.notification.dtos.res.NotificationUnreadCountResDTO;
import vn.phantruongan.backend.notification.services.ManagementReviewNotificationService;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.annotations.RequirePermission;

@RestController
@RequestMapping(ApiPaths.ADMIN_REVIEW_NOTIFICATIONS)
@RequiredArgsConstructor
public class ManagementReviewNotificationController {

    private final ManagementReviewNotificationService notificationService;

    @GetMapping
    @RequirePermission(resource = ResourceEnum.NOTIFICATION, action = ActionEnum.READ)
    @ApiMessage("Get pending management review notifications")
    public ResponseEntity<PaginationResponse<ManagementReviewNotificationResDTO>> getPendingReviews(
            @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(notificationService.getPendingReviews(pageable));
    }

    @GetMapping("/pending-count")
    @RequirePermission(resource = ResourceEnum.NOTIFICATION, action = ActionEnum.READ)
    @ApiMessage("Get pending management review count")
    public ResponseEntity<NotificationUnreadCountResDTO> getPendingReviewCount() {
        return ResponseEntity.ok(notificationService.getPendingCount());
    }
}
