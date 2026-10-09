package vn.phantruongan.backend.notification.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.authorization.entities.Role;
import vn.phantruongan.backend.common.security.CurrentUserService;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.notification.entities.Notification;
import vn.phantruongan.backend.notification.enums.NotificationType;
import vn.phantruongan.backend.notification.repositories.NotificationRepository;
import vn.phantruongan.backend.resume.entities.Resume;
import vn.phantruongan.backend.resume.enums.ResumeEnum;
import vn.phantruongan.backend.util.error.InvalidException;
import vn.phantruongan.backend.util.error.PermissionDeniedException;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock NotificationRepository notificationRepository;
    @Mock UserRepository userRepository;
    @Mock CurrentUserService currentUserService;
    @InjectMocks NotificationService service;

    @Test
    void notificationListUsesAuthenticatedCandidateIdAndPage() {
        User candidate = user(12L, "CANDIDATE");
        Notification notification = notification(candidate);
        PageRequest pageable = PageRequest.of(0, 10);
        when(currentUserService.getCurrentUserEmail()).thenReturn(candidate.getEmail());
        when(userRepository.findByEmail(candidate.getEmail())).thenReturn(Optional.of(candidate));
        when(notificationRepository.findByUser_IdOrderByCreatedAtDescIdDesc(12L, pageable))
                .thenReturn(new PageImpl<>(List.of(notification), pageable, 1));

        var result = service.getMyNotifications(pageable);

        assertEquals(1, result.getResult().size());
        assertEquals(1, result.getMeta().getPageNumber());
        verify(notificationRepository).findByUser_IdOrderByCreatedAtDescIdDesc(12L, pageable);
    }

    @Test
    void unreadCountIsScopedToAuthenticatedCandidate() {
        User candidate = user(12L, "CANDIDATE");
        when(currentUserService.getCurrentUserEmail()).thenReturn(candidate.getEmail());
        when(userRepository.findByEmail(candidate.getEmail())).thenReturn(Optional.of(candidate));
        when(notificationRepository.countByUser_IdAndReadFalse(12L)).thenReturn(3L);

        assertEquals(3L, service.getMyUnreadCount().getCount());
        verify(notificationRepository).countByUser_IdAndReadFalse(12L);
    }

    @Test
    void markingOneReadAlwaysScopesUpdateToNotificationAndCandidate() throws Exception {
        User candidate = user(12L, "CANDIDATE");
        when(currentUserService.getCurrentUserEmail()).thenReturn(candidate.getEmail());
        when(userRepository.findByEmail(candidate.getEmail())).thenReturn(Optional.of(candidate));
        when(notificationRepository.markReadByIdAndUserId(55L, 12L)).thenReturn(1);

        service.markAsRead(55L);

        verify(notificationRepository).markReadByIdAndUserId(55L, 12L);
    }

    @Test
    void markingAnotherUsersNotificationReturnsSameNotFoundResponse() {
        User candidate = user(12L, "CANDIDATE");
        when(currentUserService.getCurrentUserEmail()).thenReturn(candidate.getEmail());
        when(userRepository.findByEmail(candidate.getEmail())).thenReturn(Optional.of(candidate));
        when(notificationRepository.markReadByIdAndUserId(55L, 12L)).thenReturn(0);

        assertThrows(InvalidException.class, () -> service.markAsRead(55L));
        verify(notificationRepository).markReadByIdAndUserId(55L, 12L);
    }

    @Test
    void markAllReadOnlyUpdatesAuthenticatedCandidatesRows() {
        User candidate = user(12L, "CANDIDATE");
        when(currentUserService.getCurrentUserEmail()).thenReturn(candidate.getEmail());
        when(userRepository.findByEmail(candidate.getEmail())).thenReturn(Optional.of(candidate));
        when(notificationRepository.markAllReadByUserId(12L)).thenReturn(2);

        assertEquals(2, service.markAllAsRead());
        verify(notificationRepository).markAllReadByUserId(12L);
    }

    @Test
    void rejectsSystemFallbackInsteadOfUsingItAsRecipient() {
        when(currentUserService.getCurrentUserEmail()).thenReturn("SYSTEM");

        assertThrows(BadCredentialsException.class, service::getMyUnreadCount);
        verifyNoInteractions(userRepository, notificationRepository);
    }

    @Test
    void rejectsAuthenticatedNonCandidate() {
        User employer = user(20L, "EMPLOYER");
        when(currentUserService.getCurrentUserEmail()).thenReturn(employer.getEmail());
        when(userRepository.findByEmail(employer.getEmail())).thenReturn(Optional.of(employer));

        assertThrows(PermissionDeniedException.class, service::getMyUnreadCount);
        verifyNoInteractions(notificationRepository);
    }

    @Test
    void statusNotificationStoresSafeApplicationNavigationData() {
        User candidate = user(12L, "CANDIDATE");
        Job job = new Job();
        job.setId(25L);
        job.setName("Backend Engineer");
        Resume resume = new Resume();
        resume.setId(55L);
        resume.setUser(candidate);
        resume.setJob(job);
        resume.setStatus(ResumeEnum.REVIEWING);

        service.createApplicationStatusChanged(resume);

        verify(notificationRepository).save(argThat(notification ->
                notification.getUser() == candidate
                        && notification.getType() == NotificationType.APPLICATION_STATUS_CHANGED
                        && notification.getApplicationStatus() == ResumeEnum.REVIEWING
                        && notification.getRelatedResumeId().equals(55L)
                        && notification.getJobId().equals(25L)
                        && notification.getJobTitle().equals("Backend Engineer")));
    }

    private Notification notification(User user) {
        Notification notification = new Notification();
        notification.setId(1L);
        notification.setUser(user);
        notification.setType(NotificationType.APPLICATION_STATUS_CHANGED);
        notification.setApplicationStatus(ResumeEnum.REVIEWING);
        notification.setRelatedResumeId(55L);
        notification.setJobId(25L);
        notification.setJobTitle("Backend Engineer");
        notification.setCreatedAt(Instant.now());
        return notification;
    }

    private User user(long id, String roleName) {
        Role role = new Role();
        role.setName(roleName);
        User user = new User();
        user.setId(id);
        user.setEmail(roleName.toLowerCase() + "@example.test");
        user.setRole(role);
        return user;
    }
}
