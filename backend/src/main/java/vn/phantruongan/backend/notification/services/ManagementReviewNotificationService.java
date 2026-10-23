package vn.phantruongan.backend.notification.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.common.security.CurrentUserService;
import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.notification.dtos.res.ManagementReviewNotificationResDTO;
import vn.phantruongan.backend.notification.dtos.res.NotificationUnreadCountResDTO;
import vn.phantruongan.backend.notification.entities.ManagementReviewNotification;
import vn.phantruongan.backend.notification.repositories.ManagementReviewNotificationRepository;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.util.error.PermissionDeniedException;

@Service
@RequiredArgsConstructor
public class ManagementReviewNotificationService {

    public static final String COMPANY_REVIEW = "COMPANY_REVIEW_REQUIRED";
    public static final String JOB_REVIEW = "JOB_REVIEW_REQUIRED";

    private final ManagementReviewNotificationRepository reviewRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    @Transactional
    public void requireCompanyReview(Company company) {
        if (company == null || company.getId() <= 0 || company.getStatus() == null) return;
        for (User reviewer : reviewRecipients(ResourceEnum.COMPANY, ActionEnum.UPDATE)) {
            String key = "company-review:" + company.getId() + ":" + reviewer.getId();
            ManagementReviewNotification item = reviewRepository.findByDeduplicationKey(key)
                    .orElseGet(ManagementReviewNotification::new);
            item.setReviewer(reviewer);
            item.setReviewType(COMPANY_REVIEW);
            item.setTargetId(company.getId());
            item.setCompanyId(company.getId());
            item.setCompanyName(company.getName());
            item.setJobId(null);
            item.setJobTitle(null);
            item.setReviewStatus(company.getStatus().name());
            item.setDeduplicationKey(key);
            item.setResolvedAt(null);
            reviewRepository.save(item);
        }
    }

    @Transactional
    public void resolveCompanyReview(long companyId) {
        reviewRepository.resolvePending(COMPANY_REVIEW, companyId);
    }

    @Transactional
    public void requireJobReview(Job job) {
        if (job == null || job.getId() <= 0) return;
        for (User reviewer : reviewRecipients(ResourceEnum.JOB, ActionEnum.UPDATE)) {
            String key = "job-review:" + job.getId() + ":" + reviewer.getId();
            ManagementReviewNotification item = reviewRepository.findByDeduplicationKey(key).orElse(null);
            if (item != null && item.getResolvedAt() != null) {
                continue;
            }
            if (item == null) {
                item = new ManagementReviewNotification();
            }
            item.setReviewer(reviewer);
            item.setReviewType(JOB_REVIEW);
            item.setTargetId(job.getId());
            item.setCompanyId(job.getCompany() == null ? null : job.getCompany().getId());
            item.setCompanyName(job.getCompany() == null ? null : job.getCompany().getName());
            item.setJobId(job.getId());
            item.setJobTitle(job.getName());
            item.setReviewStatus("INACTIVE");
            item.setDeduplicationKey(key);
            item.setResolvedAt(null);
            reviewRepository.save(item);
        }
    }

    @Transactional
    public void resolveJobReview(long jobId) {
        reviewRepository.resolvePending(JOB_REVIEW, jobId);
    }

    @Transactional(readOnly = true)
    public PaginationResponse<ManagementReviewNotificationResDTO> getPendingReviews(Pageable pageable) {
        User reviewer = currentReviewer();
        Page<ManagementReviewNotification> page = reviewRepository
                .findByReviewer_IdAndResolvedAtIsNullOrderByCreatedAtDescIdDesc(reviewer.getId(), pageable);
        List<ManagementReviewNotificationResDTO> result = page.getContent().stream().map(this::toDto).toList();
        PaginationResponse.Meta meta = new PaginationResponse.Meta(
                page.getNumber() + 1, page.getSize(), page.getTotalElements(), page.getTotalPages());
        return new PaginationResponse<>(result, meta);
    }

    @Transactional(readOnly = true)
    public NotificationUnreadCountResDTO getPendingCount() {
        return new NotificationUnreadCountResDTO(reviewRepository.countByReviewer_IdAndResolvedAtIsNull(
                currentReviewer().getId()));
    }

    private List<User> reviewRecipients(ResourceEnum resource, ActionEnum action) {
        return userRepository.findActiveReviewers(resource, action);
    }

    private User currentReviewer() {
        String email = currentUserService.getCurrentUserEmail();
        if (email == null || email.isBlank() || "SYSTEM".equalsIgnoreCase(email)
                || "anonymousUser".equalsIgnoreCase(email)) {
            throw new BadCredentialsException("An authenticated reviewer is required.");
        }
        User reviewer = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Authenticated user account not found."));
        String role = reviewer.getRole() == null ? "" : reviewer.getRole().getName();
        if (!"ADMIN".equalsIgnoreCase(role) && !"MANAGER".equalsIgnoreCase(role)) {
            throw new PermissionDeniedException("Only administrators and managers can access review notifications.");
        }
        return reviewer;
    }

    private ManagementReviewNotificationResDTO toDto(ManagementReviewNotification item) {
        return ManagementReviewNotificationResDTO.builder()
                .id(item.getId())
                .type(item.getReviewType())
                .companyId(item.getCompanyId())
                .companyName(item.getCompanyName())
                .jobId(item.getJobId())
                .jobTitle(item.getJobTitle())
                .reviewStatus(item.getReviewStatus())
                .createdAt(item.getCreatedAt())
                .build();
    }
}
