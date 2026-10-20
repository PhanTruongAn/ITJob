package vn.phantruongan.backend.notification.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.authorization.entities.Role;
import vn.phantruongan.backend.authorization.repositories.RoleRepository;
import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.company.entities.CompanyStatus;
import vn.phantruongan.backend.company.repositories.CompanyRepository;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.job.repositories.JobRepository;
import vn.phantruongan.backend.notification.entities.Notification;
import vn.phantruongan.backend.notification.enums.NotificationType;
import vn.phantruongan.backend.notification.repositories.NotificationRepository;
import vn.phantruongan.backend.resume.dtos.req.CreateResumeReqDTO;
import vn.phantruongan.backend.resume.entities.Resume;
import vn.phantruongan.backend.resume.repositories.ResumeRepository;
import vn.phantruongan.backend.resume.services.ResumeService;
import vn.phantruongan.backend.util.error.InvalidException;
import vn.phantruongan.backend.util.error.PermissionDeniedException;

@SpringBootTest
@Transactional
class EmployerApplicationNotificationIntegrationTest {

    @Autowired private NotificationService notificationService;
    @Autowired private ResumeService resumeService;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private ResumeRepository resumeRepository;
    @Autowired private CompanyRepository companyRepository;
    @Autowired private JobRepository jobRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private EntityManager entityManager;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void successfulEligibleApplicationCreatesOneSafeNotificationForEachOwningEmployer() {
        String suffix = UUID.randomUUID().toString();
        Company company = saveCompany("Approved " + suffix, CompanyStatus.APPROVED);
        User employer = saveUser("EMPLOYER", company, suffix + "-employer");
        User secondEmployer = saveUser("EMPLOYER", company, suffix + "-employer-2");
        User otherEmployer = saveUser("EMPLOYER", saveCompany("Other " + suffix, CompanyStatus.APPROVED),
                suffix + "-other-employer");
        User candidate = saveUser("CANDIDATE", null, suffix + "-candidate");
        Job job = saveJob(company, "Backend Engineer " + suffix, true);
        authenticate(candidate);

        CreateResumeReqDTO request = applicationRequest(job.getId(), "Candidate Name", suffix);
        var created = resumeService.createResumeForCurrentCandidate(request);
        Resume application = resumeRepository.findById(created.getId()).orElseThrow();
        assertThrows(InvalidException.class, () -> resumeService.createResumeForCurrentCandidate(request));

        notificationService.createApplicationReceived(application);
        entityManager.flush();

        var employerNotifications = notificationRepository.findByUser_IdAndCategoryOrderByCreatedAtDescIdDesc(
                employer.getId(), Notification.APPLICATION_RECEIVED_CATEGORY, PageRequest.of(0, 10));
        var secondEmployerNotifications = notificationRepository.findByUser_IdAndCategoryOrderByCreatedAtDescIdDesc(
                secondEmployer.getId(), Notification.APPLICATION_RECEIVED_CATEGORY, PageRequest.of(0, 10));
        var otherEmployerNotifications = notificationRepository.findByUser_IdAndCategoryOrderByCreatedAtDescIdDesc(
                otherEmployer.getId(), Notification.APPLICATION_RECEIVED_CATEGORY, PageRequest.of(0, 10));

        assertEquals(1, employerNotifications.getTotalElements());
        assertEquals(1, secondEmployerNotifications.getTotalElements());
        assertEquals(0, otherEmployerNotifications.getTotalElements());
        var notification = employerNotifications.getContent().get(0);
        assertEquals(application.getId(), notification.getRelatedResumeId());
        assertEquals(job.getId(), notification.getJobId());
        assertEquals(job.getName(), notification.getJobTitle());
        assertEquals("Candidate Name", notification.getCandidateName());
        assertTrue(notification.getDeduplicationKey().contains(Long.toString(application.getId())));
        assertEquals(1, notificationRepository.countByUser_IdAndCategoryAndReadFalse(
                employer.getId(), Notification.APPLICATION_RECEIVED_CATEGORY));

        notificationService.createApplicationReceived(application);
        entityManager.flush();
        assertEquals(1, notificationRepository.countByUser_IdAndCategoryAndReadFalse(
                employer.getId(), Notification.APPLICATION_RECEIVED_CATEGORY));

        authenticate(employer);
        var page = notificationService.getMyEmployerNotifications(PageRequest.of(0, 10));
        assertEquals(1, page.getResult().size());
        assertEquals("Candidate Name", page.getResult().get(0).getCandidateName());
        assertEquals(1, notificationService.getMyEmployerUnreadCount().getCount());
    }

    @Test
    void ineligibleApplicationDoesNotPersistApplicationOrEmployerNotification() {
        String suffix = UUID.randomUUID().toString();
        Company company = saveCompany("Pending " + suffix, CompanyStatus.PENDING);
        User employer = saveUser("EMPLOYER", company, suffix + "-employer");
        User candidate = saveUser("CANDIDATE", null, suffix + "-candidate");
        Job job = saveJob(company, "Hidden job " + suffix, true);
        authenticate(candidate);

        assertThrows(InvalidException.class,
                () -> resumeService.createResumeForCurrentCandidate(applicationRequest(job.getId(), "Candidate", suffix)));

        assertTrue(resumeRepository.findByUserIdAndJobId(candidate.getId(), job.getId()).isEmpty());
        assertEquals(0, notificationRepository.countByUser_IdAndCategoryAndReadFalse(
                employer.getId(), Notification.APPLICATION_RECEIVED_CATEGORY));
    }

    @Test
    void employerCanOnlyReadAndUpdateTheirOwnApplicationNotifications() throws Exception {
        String suffix = UUID.randomUUID().toString();
        Company company = saveCompany("Company " + suffix, CompanyStatus.APPROVED);
        User employer = saveUser("EMPLOYER", company, suffix + "-employer");
        User otherEmployer = saveUser("EMPLOYER", saveCompany("Other " + suffix, CompanyStatus.APPROVED),
                suffix + "-other-employer");
        Notification notification = saveNotification(employer, 101L, "application-received:101:" + employer.getId());
        saveNotification(employer, 103L, "application-received:103:" + employer.getId());
        Notification otherNotification = saveNotification(
                otherEmployer, 102L, "application-received:102:" + otherEmployer.getId());
        authenticate(employer);

        assertEquals(2, notificationService.getMyEmployerNotifications(PageRequest.of(0, 10)).getResult().size());
        assertEquals(2, notificationService.getMyEmployerUnreadCount().getCount());
        assertThrows(InvalidException.class,
                () -> notificationService.markEmployerNotificationAsRead(otherNotification.getId()));

        notificationService.markEmployerNotificationAsRead(notification.getId());
        assertEquals(1, notificationService.getMyEmployerUnreadCount().getCount());
        entityManager.clear();
        assertTrue(notificationRepository.findById(notification.getId()).orElseThrow().isRead());
        assertTrue(!notificationRepository.findById(otherNotification.getId()).orElseThrow().isRead());

        notificationService.markAllEmployerNotificationsAsRead();
        assertEquals(0, notificationService.getMyEmployerUnreadCount().getCount());
    }

    @Test
    void candidateCannotUseEmployerNotificationOperations() {
        String suffix = UUID.randomUUID().toString();
        User candidate = saveUser("CANDIDATE", null, suffix + "-candidate");
        authenticate(candidate);

        assertThrows(PermissionDeniedException.class,
                () -> notificationService.getMyEmployerUnreadCount());
    }

    @Test
    void databaseUniqueKeyRejectsDuplicateApplicationNotifications() {
        String suffix = UUID.randomUUID().toString();
        User employer = saveUser("EMPLOYER", saveCompany("Company " + suffix, CompanyStatus.APPROVED),
                suffix + "-employer");
        String key = "application-received:999:" + employer.getId();
        notificationRepository.saveAndFlush(notification(employer, 999L, key));

        assertThrows(DataIntegrityViolationException.class,
                () -> notificationRepository.saveAndFlush(notification(employer, 999L, key)));
    }

    private Company saveCompany(String name, CompanyStatus status) {
        Company company = new Company();
        company.setName(name);
        company.setStatus(status);
        return companyRepository.saveAndFlush(company);
    }

    private User saveUser(String roleName, Company company, String suffix) {
        Role role = roleRepository.findByName(roleName).orElseThrow();
        User user = new User();
        user.setName(roleName + " " + suffix);
        user.setEmail(suffix + "@example.test");
        user.setRole(role);
        user.setCompany(company);
        user.setVerified(true);
        return userRepository.saveAndFlush(user);
    }

    private Job saveJob(Company company, String name, boolean active) {
        Job job = new Job();
        job.setName(name);
        job.setCompany(company);
        job.setActive(active);
        return jobRepository.saveAndFlush(job);
    }

    private CreateResumeReqDTO applicationRequest(long jobId, String candidateName, String suffix) {
        CreateResumeReqDTO request = new CreateResumeReqDTO();
        request.setCandidateName(candidateName);
        request.setPhoneNumber("555-0100");
        request.setEmail(suffix + "@candidate.example.test");
        request.setJobId(jobId);
        return request;
    }

    private Notification saveNotification(User user, long resumeId, String deduplicationKey) {
        return notificationRepository.saveAndFlush(notification(user, resumeId, deduplicationKey));
    }

    private Notification notification(User user, long resumeId, String deduplicationKey) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(NotificationType.APPLICATION_STATUS_CHANGED);
        notification.setCategory(Notification.APPLICATION_RECEIVED_CATEGORY);
        notification.setRelatedResumeId(resumeId);
        notification.setJobId(1L);
        notification.setJobTitle("Job");
        notification.setCandidateName("Candidate");
        notification.setDeduplicationKey(deduplicationKey);
        return notification;
    }

    private void authenticate(User user) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(user.getEmail(), "test", List.of()));
    }
}
