package vn.phantruongan.backend.resume.services;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.transaction.annotation.Transactional;

import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.authorization.entities.Role;
import vn.phantruongan.backend.common.security.CurrentUserService;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.job.repositories.JobRepository;
import vn.phantruongan.backend.log.services.AuditLogService;
import vn.phantruongan.backend.notification.services.NotificationService;
import vn.phantruongan.backend.resume.dtos.res.ResumeResDTO;
import vn.phantruongan.backend.resume.entities.Resume;
import vn.phantruongan.backend.resume.enums.ResumeEnum;
import vn.phantruongan.backend.resume.mappers.ResumeMapper;
import vn.phantruongan.backend.resume.repositories.ResumeRepository;
import vn.phantruongan.backend.util.error.InvalidException;

@ExtendWith(MockitoExtension.class)
class ResumeServiceNotificationTest {

    @Mock ResumeRepository resumeRepository;
    @Mock ResumeMapper resumeMapper;
    @Mock UserRepository userRepository;
    @Mock JobRepository jobRepository;
    @Mock CurrentUserService currentUserService;
    @Mock AuditLogService auditLogService;
    @Mock NotificationService notificationService;
    @InjectMocks ResumeService service;

    private Resume application;

    @BeforeEach
    void setUp() {
        User admin = user(1L, "ADMIN");
        User candidate = user(2L, "CANDIDATE");
        Job job = new Job();
        job.setId(30L);
        job.setName("Backend Engineer");

        application = new Resume();
        application.setId(40L);
        application.setUser(candidate);
        application.setJob(job);
        when(currentUserService.getCurrentUserEmail()).thenReturn("admin@example.test");
        when(userRepository.findByEmail("admin@example.test")).thenReturn(Optional.of(admin));
        when(resumeRepository.findById(40L)).thenReturn(Optional.of(application));
        when(resumeRepository.save(any(Resume.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(resumeMapper.toDto(any(Resume.class))).thenReturn(new ResumeResDTO());
    }

    @Test
    void createsNotificationWhenApplicationMovesToReviewing() throws Exception {
        application.setStatus(ResumeEnum.PENDING);

        service.reviewResume(40L);

        verify(notificationService).createApplicationStatusChanged(application);
        assertTrue(application.getStatus() == ResumeEnum.REVIEWING);
    }

    @Test
    void createsNotificationWhenApplicationIsApproved() throws Exception {
        application.setStatus(ResumeEnum.REVIEWING);

        service.approveResume(40L);

        verify(notificationService).createApplicationStatusChanged(application);
        assertTrue(application.getStatus() == ResumeEnum.APPROVED);
    }

    @Test
    void createsNotificationWhenApplicationIsRejected() throws Exception {
        application.setStatus(ResumeEnum.REVIEWING);

        service.rejectResume(40L, "Not a match");

        verify(notificationService).createApplicationStatusChanged(application);
        assertTrue(application.getStatus() == ResumeEnum.REJECTED);
    }

    @Test
    void doesNotCreateNotificationWhenStatusDoesNotChange() {
        application.setStatus(ResumeEnum.REVIEWING);
        assertThrows(InvalidException.class, () -> service.reviewResume(40L));
        verify(notificationService, never()).createApplicationStatusChanged(any(Resume.class));
    }

    @Test
    void doesNotCreateNotificationWhenAlreadyApproved() {
        application.setStatus(ResumeEnum.APPROVED);
        assertThrows(InvalidException.class, () -> service.approveResume(40L));
        verify(notificationService, never()).createApplicationStatusChanged(any(Resume.class));
    }

    @Test
    void doesNotCreateNotificationWhenAlreadyRejected() {
        application.setStatus(ResumeEnum.REJECTED);
        assertThrows(InvalidException.class, () -> service.rejectResume(40L, null));
        verify(notificationService, never()).createApplicationStatusChanged(any(Resume.class));
    }

    @Test
    void applicationStatusAndNotificationUseTransactionalServiceBoundaries() throws Exception {
        assertTrue(ResumeService.class.getMethod("reviewResume", long.class)
                .isAnnotationPresent(Transactional.class));
        assertTrue(ResumeService.class.getMethod("approveResume", long.class)
                .isAnnotationPresent(Transactional.class));
        assertTrue(ResumeService.class.getMethod("rejectResume", long.class, String.class)
                .isAnnotationPresent(Transactional.class));
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
