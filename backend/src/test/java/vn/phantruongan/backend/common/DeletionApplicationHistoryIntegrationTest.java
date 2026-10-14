package vn.phantruongan.backend.common;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.authentication.services.UserService;
import vn.phantruongan.backend.authorization.dtos.req.role.UpdateRoleReqDTO;
import vn.phantruongan.backend.authorization.entities.Role;
import vn.phantruongan.backend.authorization.repositories.RoleRepository;
import vn.phantruongan.backend.authorization.services.RoleService;
import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.company.repositories.CompanyRepository;
import vn.phantruongan.backend.company.services.CompanyService;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.job.repositories.JobRepository;
import vn.phantruongan.backend.job.services.JobService;
import vn.phantruongan.backend.resume.entities.Resume;
import vn.phantruongan.backend.resume.enums.ResumeEnum;
import vn.phantruongan.backend.resume.repositories.ResumeRepository;
import vn.phantruongan.backend.util.error.InvalidException;
import vn.phantruongan.backend.util.error.PermissionDeniedException;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class DeletionApplicationHistoryIntegrationTest {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private JobService jobService;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private MockMvc mockMvc;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void adminCanDeleteJobWithoutApplications() {
        User admin = saveUser("ADMIN", null);
        Job job = saveJob(saveCompany(), "No applications");
        authenticate(admin);

        assertTrue(jobService.deleteJobById(job.getId()));
        assertFalse(jobRepository.existsById(job.getId()));
    }

    @Test
    void adminAndManagerCannotDeleteJobWithApplicationHistory() {
        for (String roleName : new String[] { "ADMIN", "MANAGER" }) {
            Company company = saveCompany();
            User candidate = saveUser("CANDIDATE", null);
            Job job = saveJob(company, roleName + " protected job");
            Resume application = saveApplication(candidate, job, ResumeEnum.REVIEWING);
            User operator = saveUser(roleName, null);
            authenticate(operator);

            assertThrows(InvalidException.class, () -> jobService.deleteJobById(job.getId()));
            assertTrue(jobRepository.existsById(job.getId()));
            assertEquals(ResumeEnum.REVIEWING,
                    resumeRepository.findById(application.getId()).orElseThrow().getStatus());
        }
    }

    @Test
    void adminAndManagerCannotDeleteCompanyWhoseJobHasApplicationHistory() {
        for (String roleName : new String[] { "ADMIN", "MANAGER" }) {
            Company company = saveCompany();
            Job job = saveJob(company, roleName + " company protected job");
            User candidate = saveUser("CANDIDATE", null);
            Resume application = saveApplication(candidate, job, ResumeEnum.APPROVED);
            User operator = saveUser(roleName, null);
            authenticate(operator);

            assertThrows(InvalidException.class, () -> companyService.deleteCompanyById(company.getId()));
            assertTrue(companyRepository.existsById(company.getId()));
            assertTrue(jobRepository.existsById(job.getId()));
            assertEquals(ResumeEnum.APPROVED,
                    resumeRepository.findById(application.getId()).orElseThrow().getStatus());
        }
    }

    @Test
    void companyGuardAlsoProtectsApplicationsOwnedByUsersCascadeDeletedWithCompany() {
        Company employerCompany = saveCompany();
        Company unrelatedCompany = saveCompany();
        User companyUser = saveUser("EMPLOYER", employerCompany);
        Job unrelatedJob = saveJob(unrelatedCompany, "Unrelated job");
        Resume application = saveApplication(companyUser, unrelatedJob, ResumeEnum.PENDING);
        User manager = saveUser("MANAGER", null);
        authenticate(manager);

        assertThrows(InvalidException.class, () -> companyService.deleteCompanyById(employerCompany.getId()));
        assertTrue(companyRepository.existsById(employerCompany.getId()));
        assertEquals(ResumeEnum.PENDING,
                resumeRepository.findById(application.getId()).orElseThrow().getStatus());
    }

    @Test
    void companyWithoutApplicationsCanStillBeDeletedByManager() {
        Company company = saveCompany();
        Job job = saveJob(company, "Company without applications");
        User manager = saveUser("MANAGER", null);
        authenticate(manager);
        entityManager.flush();
        entityManager.clear();

        assertTrue(companyService.deleteCompanyById(company.getId()));
        assertFalse(companyRepository.existsById(company.getId()));
        assertFalse(jobRepository.existsById(job.getId()));
    }

    @Test
    void employerCanDeleteOwnJobWithoutApplicationsButCannotDeleteAnotherCompanyJob() {
        Company ownCompany = saveCompany();
        Company otherCompany = saveCompany();
        User employer = saveUser("EMPLOYER", ownCompany);
        Job ownJob = saveJob(ownCompany, "Employer own job");
        Job otherJob = saveJob(otherCompany, "Employer other job");
        authenticate(employer);

        assertTrue(jobService.deleteJobById(ownJob.getId()));
        assertFalse(jobRepository.existsById(ownJob.getId()));
        assertThrows(PermissionDeniedException.class, () -> jobService.deleteJobById(otherJob.getId()));
        assertTrue(jobRepository.existsById(otherJob.getId()));
    }

    @Test
    void employerCannotDeleteOwnJobWithApplicationsOrAnyCompany() {
        Company ownCompany = saveCompany();
        User employer = saveUser("EMPLOYER", ownCompany);
        User candidate = saveUser("CANDIDATE", null);
        Job job = saveJob(ownCompany, "Employer application job");
        Resume application = saveApplication(candidate, job, ResumeEnum.REJECTED);
        authenticate(employer);

        assertThrows(InvalidException.class, () -> jobService.deleteJobById(job.getId()));
        assertTrue(jobRepository.existsById(job.getId()));
        assertEquals(ResumeEnum.REJECTED,
                resumeRepository.findById(application.getId()).orElseThrow().getStatus());
        assertThrows(PermissionDeniedException.class, () -> companyService.deleteCompanyById(ownCompany.getId()));
        assertTrue(companyRepository.existsById(ownCompany.getId()));
    }

    @Test
    void deletingUserSoftDeletesAccountAndPreservesApplicationHistory() throws Exception {
        User admin = saveUser("ADMIN", null);
        User candidate = saveUser("CANDIDATE", null);
        Job job = saveJob(saveCompany(), "Application history after user deletion");
        Resume application = saveApplication(candidate, job, ResumeEnum.REVIEWING);
        entityManager.flush();
        authenticate(admin);

        assertTrue(userService.deleteUserById(candidate.getId()));
        entityManager.flush();
        entityManager.clear();

        assertFalse(userRepository.findById(candidate.getId()).isPresent());
        assertTrue(jdbcTemplate.queryForObject(
                "SELECT deleted FROM users WHERE id = ?", Boolean.class, candidate.getId()));
        assertEquals(1, jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM resumes WHERE id = ? AND user_id = ?",
                Integer.class, application.getId(), candidate.getId()));
        assertEquals(ResumeEnum.REVIEWING,
                resumeRepository.findById(application.getId()).orElseThrow().getStatus());
    }

    @Test
    void deletingUserWithoutApplicationsStillSoftDeletesAccount() throws Exception {
        User admin = saveUser("ADMIN", null);
        User candidate = saveUser("CANDIDATE", null);
        authenticate(admin);

        assertTrue(userService.deleteUserById(candidate.getId()));
        entityManager.flush();
        entityManager.clear();

        assertFalse(userRepository.findById(candidate.getId()).isPresent());
        assertTrue(jdbcTemplate.queryForObject(
                "SELECT deleted FROM users WHERE id = ?", Boolean.class, candidate.getId()));
    }

    @Test
    void authenticatedAdminCannotDeleteOwnAccountThroughDirectApiCall() throws Exception {
        User admin = saveUser("ADMIN", null);

        mockMvc.perform(delete("/api/v1/users/{id}", admin.getId())
                        .with(SecurityMockMvcRequestPostProcessors.jwt()
                                .jwt(jwt -> jwt.subject(admin.getEmail()))))
                .andExpect(status().isForbidden());

        assertTrue(userRepository.findById(admin.getId()).isPresent());
    }

    @Test
    void authenticatedNonAdminCannotDeleteOwnAccountThroughService() {
        User manager = saveUser("MANAGER", null);
        authenticate(manager);

        assertThrows(PermissionDeniedException.class,
                () -> userService.deleteUserById(manager.getId()));
        assertTrue(userRepository.findById(manager.getId()).isPresent());
    }

    @Test
    void adminCanDeleteAnotherAdminWhenAnActiveAdminRemains() throws Exception {
        User actor = saveUser("ADMIN", null);
        User target = saveUser("ADMIN", null);
        authenticate(actor);

        assertTrue(userService.deleteUserById(target.getId()));
        assertTrue(userRepository.findById(actor.getId()).isPresent());
        assertFalse(userRepository.findById(target.getId()).isPresent());
    }

    @Test
    void cannotDeactivateAdminRoleWhileItHasActiveAdminUsers() {
        User admin = saveUser("ADMIN", null);
        Role adminRole = roleRepository.findByName("ADMIN").orElseThrow();
        UpdateRoleReqDTO request = new UpdateRoleReqDTO();
        request.setId(adminRole.getId());
        request.setName("ADMIN");
        request.setDescription(adminRole.getDescription());
        request.setActive(false);

        assertThrows(InvalidException.class, () -> roleService.updateRole(request));
        assertTrue(roleRepository.findById(adminRole.getId()).orElseThrow().isActive());
        assertTrue(userRepository.findById(admin.getId()).isPresent());
    }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    void concurrentAdminDeletionCannotRemoveTheRemainingActiveAdmins() throws Exception {
        long existingActiveAdmins = userRepository.countActiveUsersByRoleName("ADMIN");
        User firstAdmin = saveUser("ADMIN", null);
        User secondAdmin = saveUser("ADMIN", null);
        CountDownLatch start = new CountDownLatch(1);

        try {
            CompletableFuture<Object> first = CompletableFuture.supplyAsync(
                    () -> deleteAs(firstAdmin, secondAdmin, start));
            CompletableFuture<Object> second = CompletableFuture.supplyAsync(
                    () -> deleteAs(secondAdmin, firstAdmin, start));
            start.countDown();

            Object firstResult = first.get(15, TimeUnit.SECONDS);
            Object secondResult = second.get(15, TimeUnit.SECONDS);

            long remainingAdmins = userRepository.countActiveUsersByRoleName("ADMIN");
            assertTrue(Boolean.TRUE.equals(firstResult) || Boolean.TRUE.equals(secondResult));
            assertTrue(remainingAdmins >= existingActiveAdmins);
            if (existingActiveAdmins == 0) {
                assertTrue(Boolean.TRUE.equals(firstResult) ^ Boolean.TRUE.equals(secondResult));
                assertEquals(1L, remainingAdmins);
            }
        } finally {
            jdbcTemplate.update("DELETE FROM users WHERE email IN (?, ?)",
                    firstAdmin.getEmail(), secondAdmin.getEmail());
        }
    }

    private Object deleteAs(User actor, User target, CountDownLatch start) {
        try {
            if (!start.await(10, TimeUnit.SECONDS)) {
                return new IllegalStateException("Concurrent deletion test did not start.");
            }
            authenticate(actor);
            return userService.deleteUserById(target.getId());
        } catch (RuntimeException exception) {
            return exception;
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            return exception;
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    private Company saveCompany() {
        Company company = new Company();
        company.setName("Deletion test " + UUID.randomUUID());
        return companyRepository.saveAndFlush(company);
    }

    private Job saveJob(Company company, String label) {
        Job job = new Job();
        job.setName(label + " " + UUID.randomUUID());
        job.setCompany(company);
        return jobRepository.saveAndFlush(job);
    }

    private User saveUser(String roleName, Company company) {
        Role role = roleRepository.findByName(roleName).orElseGet(() -> {
            Role newRole = new Role();
            newRole.setName(roleName);
            newRole.setActive(true);
            return roleRepository.saveAndFlush(newRole);
        });
        User user = new User();
        user.setName("Deletion test user");
        user.setEmail("deletion-" + UUID.randomUUID() + "@example.test");
        user.setRole(role);
        user.setCompany(company);
        user.setVerified(true);
        return userRepository.saveAndFlush(user);
    }

    private Resume saveApplication(User candidate, Job job, ResumeEnum status) {
        Resume application = new Resume();
        application.setCandidateName("Test candidate");
        application.setEmail(candidate.getEmail());
        application.setUser(candidate);
        application.setJob(job);
        application.setStatus(status);
        return resumeRepository.saveAndFlush(application);
    }

    private void authenticate(User user) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(user.getEmail(), "test", List.of()));
    }
}
