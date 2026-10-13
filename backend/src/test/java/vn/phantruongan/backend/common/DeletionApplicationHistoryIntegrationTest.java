package vn.phantruongan.backend.common;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.authorization.entities.Role;
import vn.phantruongan.backend.authorization.repositories.RoleRepository;
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

@SpringBootTest
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
    private RoleRepository roleRepository;

    @Autowired
    private JobService jobService;

    @Autowired
    private CompanyService companyService;

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
