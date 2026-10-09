package vn.phantruongan.backend.resume.services;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.authorization.entities.Role;
import vn.phantruongan.backend.common.security.CurrentUserService;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.job.repositories.JobRepository;
import vn.phantruongan.backend.log.services.AuditLogService;
import vn.phantruongan.backend.notification.services.NotificationService;
import vn.phantruongan.backend.resume.dtos.req.CreateResumeReqDTO;
import vn.phantruongan.backend.resume.dtos.res.ResumeResDTO;
import vn.phantruongan.backend.resume.entities.Resume;
import vn.phantruongan.backend.resume.enums.ResumeEnum;
import vn.phantruongan.backend.resume.mappers.ResumeMapper;
import vn.phantruongan.backend.resume.repositories.ResumeRepository;

@ExtendWith(MockitoExtension.class)
class ResumeServiceIdentityTest {
    @Mock ResumeRepository resumeRepository;
    @Mock ResumeMapper resumeMapper;
    @Mock UserRepository userRepository;
    @Mock JobRepository jobRepository;
    @Mock CurrentUserService currentUserService;
    @Mock AuditLogService auditLogService;
    @Mock NotificationService notificationService;
    @InjectMocks ResumeService service;

    @Test
    void candidateCannotImpersonateAnotherUserThroughPublicResumePayload() {
        User candidate = user(7L, "CANDIDATE");
        Job job = new Job();
        job.setId(4L);
        CreateResumeReqDTO request = new CreateResumeReqDTO();
        request.setUserId(99L);
        request.setStatus(ResumeEnum.APPROVED);
        request.setJobId(4L);
        when(currentUserService.getCurrentUserEmail()).thenReturn("candidate@example.test");
        when(userRepository.findByEmail("candidate@example.test")).thenReturn(Optional.of(candidate));
        when(jobRepository.findById(4L)).thenReturn(Optional.of(job));
        when(resumeRepository.existsByUserIdAndJobId(7L, 4L)).thenReturn(false);
        Resume mappedResume = new Resume();
        mappedResume.setStatus(ResumeEnum.APPROVED);
        when(resumeMapper.toEntity(request)).thenReturn(mappedResume);
        when(resumeRepository.save(any(Resume.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(resumeMapper.toDto(any(Resume.class))).thenReturn(new ResumeResDTO());

        service.createResumeForCurrentCandidate(request);
        service.createResume(request);

        verify(resumeRepository, org.mockito.Mockito.times(2)).existsByUserIdAndJobId(7L, 4L);
        verify(resumeRepository, org.mockito.Mockito.times(2))
                .save(org.mockito.ArgumentMatchers.argThat(resume -> resume.getUser() == candidate
                        && resume.getStatus() == ResumeEnum.PENDING));
    }

    @Test
    void privilegedCreationRetainsRequestedStatus() {
        User admin = user(1L, "ADMIN");
        Job job = new Job();
        job.setId(4L);
        CreateResumeReqDTO request = new CreateResumeReqDTO();
        request.setJobId(4L);
        request.setStatus(ResumeEnum.APPROVED);
        when(currentUserService.getCurrentUserEmail()).thenReturn("admin@example.test");
        when(userRepository.findByEmail("admin@example.test")).thenReturn(Optional.of(admin));
        when(jobRepository.findById(4L)).thenReturn(Optional.of(job));
        when(resumeRepository.existsByUserIdAndJobId(1L, 4L)).thenReturn(false);
        Resume mappedResume = new Resume();
        mappedResume.setStatus(ResumeEnum.APPROVED);
        when(resumeMapper.toEntity(request)).thenReturn(mappedResume);
        when(resumeRepository.save(any(Resume.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(resumeMapper.toDto(any(Resume.class))).thenReturn(new ResumeResDTO());

        service.createResume(request);

        verify(resumeRepository).save(org.mockito.ArgumentMatchers.argThat(
                resume -> resume.getUser() == admin && resume.getStatus() == ResumeEnum.APPROVED));
    }

    @Test
    void onlyCandidateRoleCanUseCandidateApplicationCreation() {
        User employer = user(7L, "EMPLOYER");
        when(currentUserService.getCurrentUserEmail()).thenReturn("employer@example.test");
        when(userRepository.findByEmail("employer@example.test")).thenReturn(Optional.of(employer));

        assertThrows(AccessDeniedException.class,
                () -> service.createResumeForCurrentCandidate(new CreateResumeReqDTO()));
    }

    private User user(long id, String roleName) {
        Role role = new Role();
        role.setName(roleName);
        User user = new User();
        user.setId(id);
        user.setEmail("candidate@example.test");
        user.setRole(role);
        return user;
    }
}
