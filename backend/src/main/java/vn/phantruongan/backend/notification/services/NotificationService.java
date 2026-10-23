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
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.common.security.CurrentUserService;
import vn.phantruongan.backend.notification.dtos.res.NotificationResDTO;
import vn.phantruongan.backend.notification.dtos.res.NotificationUnreadCountResDTO;
import vn.phantruongan.backend.notification.entities.Notification;
import vn.phantruongan.backend.notification.enums.NotificationType;
import vn.phantruongan.backend.notification.repositories.NotificationRepository;
import vn.phantruongan.backend.resume.entities.Resume;
import vn.phantruongan.backend.resume.enums.ResumeEnum;
import vn.phantruongan.backend.util.error.InvalidException;
import vn.phantruongan.backend.util.error.PermissionDeniedException;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public PaginationResponse<NotificationResDTO> getMyNotifications(Pageable pageable) {
        User candidate = currentCandidate();
        Page<Notification> page = notificationRepository.findByUser_IdAndCategoryIsNullOrderByCreatedAtDescIdDesc(
                candidate.getId(), pageable);
        List<NotificationResDTO> result = page.getContent().stream().map(this::toDto).toList();
        PaginationResponse.Meta meta = new PaginationResponse.Meta(
                page.getNumber() + 1,
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());
        return new PaginationResponse<>(result, meta);
    }

    @Transactional(readOnly = true)
    public NotificationUnreadCountResDTO getMyUnreadCount() {
        User candidate = currentCandidate();
        return new NotificationUnreadCountResDTO(
                notificationRepository.countByUser_IdAndCategoryIsNullAndReadFalse(candidate.getId()));
    }

    @Transactional
    public void markAsRead(long notificationId) throws InvalidException {
        User candidate = currentCandidate();
        int updated = notificationRepository.markCandidateReadByIdAndUserId(notificationId, candidate.getId());
        if (updated == 0) {
            // Return the same response for an unknown ID and another user's notification.
            throw new InvalidException("Notification not found.");
        }
    }

    @Transactional
    public int markAllAsRead() {
        User candidate = currentCandidate();
        return notificationRepository.markAllCandidateReadByUserId(candidate.getId());
    }

    @Transactional(readOnly = true)
    public PaginationResponse<NotificationResDTO> getMyEmployerNotifications(Pageable pageable) {
        User employer = currentEmployer();
        Page<Notification> page = notificationRepository.findByUser_IdAndCategoryOrderByCreatedAtDescIdDesc(
                employer.getId(), Notification.APPLICATION_RECEIVED_CATEGORY, pageable);
        List<NotificationResDTO> result = page.getContent().stream().map(this::toDto).toList();
        PaginationResponse.Meta meta = new PaginationResponse.Meta(
                page.getNumber() + 1,
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());
        return new PaginationResponse<>(result, meta);
    }

    @Transactional(readOnly = true)
    public NotificationUnreadCountResDTO getMyEmployerUnreadCount() {
        User employer = currentEmployer();
        return new NotificationUnreadCountResDTO(notificationRepository.countByUser_IdAndCategoryAndReadFalse(
                employer.getId(), Notification.APPLICATION_RECEIVED_CATEGORY));
    }

    @Transactional
    public void markEmployerNotificationAsRead(long notificationId) throws InvalidException {
        User employer = currentEmployer();
        int updated = notificationRepository.markReadByIdAndUserIdAndCategory(
                notificationId, employer.getId(), Notification.APPLICATION_RECEIVED_CATEGORY);
        if (updated == 0) {
            throw new InvalidException("Notification not found.");
        }
    }

    @Transactional
    public int markAllEmployerNotificationsAsRead() {
        User employer = currentEmployer();
        return notificationRepository.markAllReadByUserIdAndCategory(
                employer.getId(), Notification.APPLICATION_RECEIVED_CATEGORY);
    }

    /** Called after a candidate application is saved, inside the application's transaction. */
    @Transactional
    public void createApplicationReceived(Resume resume) {
        if (resume == null || resume.getId() <= 0 || resume.getJob() == null
                || resume.getJob().getCompany() == null) {
            return;
        }

        Long companyId = resume.getJob().getCompany().getId();
        List<User> employers = userRepository.findAllByCompany_IdAndRole_NameIgnoreCase(companyId, "EMPLOYER");
        for (User employer : employers) {
            String deduplicationKey = "application-received:" + resume.getId() + ":" + employer.getId();
            if (notificationRepository.existsByDeduplicationKey(deduplicationKey)) {
                continue;
            }

            Notification notification = new Notification();
            notification.setUser(employer);
            notification.setType(NotificationType.APPLICATION_STATUS_CHANGED);
            notification.setCategory(Notification.APPLICATION_RECEIVED_CATEGORY);
            notification.setRelatedResumeId(resume.getId());
            notification.setJobId(resume.getJob().getId());
            notification.setJobTitle(resume.getJob().getName());
            String candidateName = resume.getCandidateName();
            if (candidateName == null || candidateName.isBlank()) {
                candidateName = resume.getUser() == null ? null : resume.getUser().getName();
            }
            notification.setCandidateName(candidateName);
            notification.setDeduplicationKey(deduplicationKey);
            notificationRepository.save(notification);
        }
    }

    /** Called by the resume status flow inside its transaction. */
    @Transactional
    public void createApplicationStatusChanged(Resume resume) {
        User candidate = resume.getUser();
        ResumeEnum status = resume.getStatus();
        if (candidate == null || candidate.getRole() == null
                || !"CANDIDATE".equalsIgnoreCase(candidate.getRole().getName())
                || status == null || status == ResumeEnum.PENDING) {
            return;
        }

        Notification notification = new Notification();
        notification.setUser(candidate);
        notification.setType(NotificationType.APPLICATION_STATUS_CHANGED);
        notification.setApplicationStatus(status);
        notification.setRelatedResumeId(resume.getId());
        if (resume.getJob() != null) {
            notification.setJobId(resume.getJob().getId());
            notification.setJobTitle(resume.getJob().getName());
        }
        notificationRepository.save(notification);
    }

    private User currentCandidate() {
        return currentUserWithRole("CANDIDATE", "Only candidates can access notifications.");
    }

    private User currentEmployer() {
        User employer = currentUserWithRole("EMPLOYER", "Only employers can access application notifications.");
        if (employer.getCompany() == null) {
            throw new PermissionDeniedException("Employer is not associated with a company.");
        }
        return employer;
    }

    private User currentUserWithRole(String roleName, String deniedMessage) {
        String email = currentUserService.getCurrentUserEmail();
        if (email == null || email.isBlank() || "SYSTEM".equalsIgnoreCase(email)
                || "anonymousUser".equalsIgnoreCase(email)) {
            throw new BadCredentialsException("An authenticated candidate is required.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Authenticated user account not found."));
        if (user.getRole() == null || !roleName.equalsIgnoreCase(user.getRole().getName())) {
            throw new PermissionDeniedException(deniedMessage);
        }
        return user;
    }

    private NotificationResDTO toDto(Notification notification) {
        return NotificationResDTO.builder()
                .id(notification.getId())
                .type(Notification.APPLICATION_RECEIVED_CATEGORY.equals(notification.getCategory())
                        ? Notification.APPLICATION_RECEIVED_CATEGORY
                        : notification.getType().name())
                .applicationStatus(notification.getApplicationStatus())
                .relatedResumeId(notification.getRelatedResumeId())
                .jobId(notification.getJobId())
                .jobTitle(notification.getJobTitle())
                .candidateName(notification.getCandidateName())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
