package vn.phantruongan.backend.job.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.authorization.entities.Role;
import vn.phantruongan.backend.authorization.repositories.RoleRepository;
import vn.phantruongan.backend.company.dtos.req.GetListCompanyReqDTO;
import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.company.repositories.CompanyRepository;
import vn.phantruongan.backend.company.services.CompanyService;
import vn.phantruongan.backend.job.dtos.req.job.CreateJobReqDTO;
import vn.phantruongan.backend.job.dtos.req.job.GetListJobReqDTO;
import vn.phantruongan.backend.job.dtos.req.job.UpdateJobReqDTO;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.job.enums.JobTypeEnum;
import vn.phantruongan.backend.job.enums.LevelEnum;
import vn.phantruongan.backend.job.repositories.JobRepository;
import vn.phantruongan.backend.notification.entities.ManagementReviewNotification;
import vn.phantruongan.backend.notification.repositories.ManagementReviewNotificationRepository;
import vn.phantruongan.backend.notification.services.ManagementReviewNotificationService;
import vn.phantruongan.backend.subscriber.entities.Skill;
import vn.phantruongan.backend.subscriber.repositories.SkillRepository;
import vn.phantruongan.backend.util.error.PermissionDeniedException;

@SpringBootTest
@Transactional
class JobCreationAndPaginationIntegrationTest {

    @Autowired
    private JobService jobService;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private ManagementReviewNotificationRepository managementReviewNotificationRepository;

    @Autowired
    private ManagementReviewNotificationService managementReviewNotificationService;

    @Autowired
    private EntityManager entityManager;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void employerCompanyOptionsAreScopedAndCreateJobUsesAuthorizedCompanyAndSupportedFields() {
        Company ownCompany = saveCompany("Employer own company");
        Company otherCompany = saveCompany("Other employer company");
        User employer = saveUser("EMPLOYER", ownCompany);
        Skill skill = new Skill();
        skill.setName("Integration skill " + UUID.randomUUID());
        skill = skillRepository.saveAndFlush(skill);
        authenticate(employer);

        var companyOptions = companyService.getCompaniesForManagement(
                new GetListCompanyReqDTO(), PageRequest.of(0, 100));
        assertEquals(1, companyOptions.getResult().size());
        assertEquals(ownCompany.getId(), companyOptions.getResult().get(0).getId());
        assertEquals(ownCompany.getName(), companyOptions.getResult().get(0).getName());

        CreateJobReqDTO request = createJobRequest(ownCompany.getId(), skill.getId());
        request.setActive(true);
        var created = jobService.createJob(request);
        assertEquals(ownCompany.getId(), created.getCompanyId());
        assertEquals(request.getName(), created.getName());
        assertEquals(request.getLevel(), created.getLevel());
        assertEquals(request.getJobType(), created.getJobType());
        assertEquals(request.getSalary(), created.getSalary());
        assertFalse(created.isActive());
        assertEquals(1, created.getJobSkills().size());

        request.setName("Unauthorized " + UUID.randomUUID());
        request.setCompanyId(otherCompany.getId());
        assertThrows(PermissionDeniedException.class, () -> jobService.createJob(request));
        assertFalse(jobRepository.findAll().stream().anyMatch(job -> job.getName().equals(request.getName())));
    }

    @Test
    void everyPermittedCreationPathStartsInactiveEvenWhenActiveIsSubmitted() {
        Company company = saveCompany("Manager create company");
        Skill skill = saveSkill();
        User manager = saveUser("MANAGER", null);
        authenticate(manager);

        CreateJobReqDTO request = createJobRequest(company.getId(), skill.getId());
        request.setActive(true);

        var created = jobService.createJob(request);

        assertFalse(created.isActive());

        request.setName("Manager create without status " + UUID.randomUUID());
        request.setActive(null);
        var createdWithoutStatus = jobService.createJob(request);
        assertFalse(createdWithoutStatus.isActive());
    }

    @Test
    void employerCannotActivateOwnInactiveJobButCanDeactivateAndPreserveActiveJobs() {
        Company company = saveCompany("Employer status company");
        User employer = saveUser("EMPLOYER", company);
        Skill skill = saveSkill();
        authenticate(employer);

        CreateJobReqDTO createRequest = createJobRequest(company.getId(), skill.getId());
        var created = jobService.createJob(createRequest);
        UpdateJobReqDTO update = updateRequest(createRequest, created.getId(), true);

        assertThrows(PermissionDeniedException.class, () -> jobService.updateJob(update));
        assertFalse(jobRepository.findById(created.getId()).orElseThrow().isActive());

        Job persisted = jobRepository.findById(created.getId()).orElseThrow();
        persisted.setActive(true); // Represents a Job previously approved by management.
        jobRepository.saveAndFlush(persisted);

        update.setActive(null);
        update.setName("Employer edit to approved job");
        jobService.updateJob(update);
        assertTrue(jobRepository.findById(created.getId()).orElseThrow().isActive());

        update.setActive(false);
        jobService.updateJob(update);
        assertFalse(jobRepository.findById(created.getId()).orElseThrow().isActive());
    }

    @Test
    void employerCannotUpdateAnotherCompanysJob() {
        Company ownCompany = saveCompany("Employer owned status company");
        Company otherCompany = saveCompany("Other status company");
        User employer = saveUser("EMPLOYER", ownCompany);
        Skill skill = saveSkill();
        authenticate(employer);

        CreateJobReqDTO createRequest = createJobRequest(ownCompany.getId(), skill.getId());
        var created = jobService.createJob(createRequest);
        UpdateJobReqDTO update = updateRequest(createRequest, created.getId(), null);
        update.setCompanyId(otherCompany.getId());

        assertThrows(PermissionDeniedException.class, () -> jobService.updateJob(update));
        assertEquals(ownCompany.getId(), jobRepository.findById(created.getId()).orElseThrow()
                .getCompany().getId());
    }

    @Test
    void adminAndManagerCanActivateJobsThroughTheExistingUpdateService() {
        for (String roleName : List.of("ADMIN", "MANAGER")) {
            Company company = saveCompany(roleName + " approval company");
            Skill skill = saveSkill();
            User manager = saveUser(roleName, null);
            authenticate(manager);

            CreateJobReqDTO createRequest = createJobRequest(company.getId(), skill.getId());
            var created = jobService.createJob(createRequest);
            UpdateJobReqDTO update = updateRequest(createRequest, created.getId(), true);

            jobService.updateJob(update);

            assertTrue(jobRepository.findById(created.getId()).orElseThrow().isActive());
        }
    }

    @Test
    void nonManagementNonEmployerCannotChangeJobStatus() {
        Company company = saveCompany("Candidate status company");
        Skill skill = saveSkill();
        User candidate = saveUser("CANDIDATE", null);
        Job job = new Job();
        job.setName("Candidate-protected job");
        job.setCompany(company);
        job = jobRepository.saveAndFlush(job);
        long jobId = job.getId();
        authenticate(candidate);
        UpdateJobReqDTO update = updateRequest(createJobRequest(company.getId(), skill.getId()), jobId, true);

        assertThrows(PermissionDeniedException.class, () -> jobService.updateJob(update));
        assertFalse(jobRepository.findById(jobId).orElseThrow().isActive());
    }

    @Test
    void firstActivationReviewStaysResolvedAcrossDeactivationReactivationAndRepeatedRequire() {
        Company company = saveCompany("First activation review company");
        User employer = saveUser("EMPLOYER", company);
        User manager = saveUser("MANAGER", null);
        Skill skill = saveSkill();
        authenticate(employer);

        CreateJobReqDTO createRequest = createJobRequest(company.getId(), skill.getId());
        var created = jobService.createJob(createRequest);
        List<ManagementReviewNotification> initialReviews = managementReviewNotificationRepository.findAll().stream()
                .filter(item -> ManagementReviewNotificationService.JOB_REVIEW.equals(item.getReviewType()))
                .filter(item -> created.getId() == item.getJobId())
                .toList();
        assertEquals(1, initialReviews.size());
        ManagementReviewNotification notification = initialReviews.get(0);
        String key = notification.getDeduplicationKey();
        assertEquals("job-review:" + created.getId() + ":" + notification.getReviewer().getId(), key);
        assertTrue(notification.getResolvedAt() == null);

        managementReviewNotificationService.requireJobReview(jobRepository.findById(created.getId()).orElseThrow());
        entityManager.flush();
        assertEquals(notification.getId(), managementReviewNotificationRepository.findByDeduplicationKey(key)
                .orElseThrow().getId());
        assertEquals(ManagementReviewNotificationService.JOB_REVIEW, notification.getReviewType());
        assertEquals(created.getId(), notification.getJobId());
        assertEquals("INACTIVE", notification.getReviewStatus());
        assertTrue(notification.getResolvedAt() == null);

        authenticate(manager);
        jobService.updateJob(updateRequest(createRequest, created.getId(), true));
        entityManager.flush();
        entityManager.clear();
        assertTrue(jobRepository.findById(created.getId()).orElseThrow().isActive());
        ManagementReviewNotification resolved = managementReviewNotificationRepository.findById(notification.getId())
                .orElseThrow();
        assertTrue(resolved.getResolvedAt() != null);

        authenticate(employer);
        jobService.updateJob(updateRequest(createRequest, created.getId(), false));
        entityManager.flush();
        entityManager.clear();
        assertFalse(jobRepository.findById(created.getId()).orElseThrow().isActive());

        assertThrows(PermissionDeniedException.class,
                () -> jobService.updateJob(updateRequest(createRequest, created.getId(), true)));
        assertFalse(jobRepository.findById(created.getId()).orElseThrow().isActive());

        authenticate(manager);
        jobService.updateJob(updateRequest(createRequest, created.getId(), true));
        entityManager.flush();
        entityManager.clear();
        assertTrue(jobRepository.findById(created.getId()).orElseThrow().isActive());

        managementReviewNotificationService.requireJobReview(jobRepository.findById(created.getId()).orElseThrow());
        entityManager.flush();
        entityManager.clear();
        ManagementReviewNotification afterReactivation = managementReviewNotificationRepository
                .findByDeduplicationKey(key).orElseThrow();
        assertEquals(notification.getId(), afterReactivation.getId());
        assertTrue(afterReactivation.getResolvedAt() != null);
        assertEquals(1, managementReviewNotificationRepository.findAll().stream()
                .filter(item -> ManagementReviewNotificationService.JOB_REVIEW.equals(item.getReviewType()))
                .filter(item -> created.getId() == item.getJobId())
                .count());
    }

    @Test
    void managementJobPaginationHasStablePagesFinalPageAndEmptyResults() {
        String prefix = "Management paging " + UUID.randomUUID();
        Company company = saveCompany(prefix);
        for (int index = 1; index <= 5; index++) {
            Job job = new Job();
            job.setName(prefix + " " + index);
            job.setCompany(company);
            job.setSalary(index * 1000.0);
            jobRepository.save(job);
        }
        entityManager.flush();

        GetListJobReqDTO filter = new GetListJobReqDTO();
        filter.setName(prefix);
        filter.setCompanyId(company.getId());
        var firstPage = jobService.getAllJobs(filter, PageRequest.of(0, 2, Sort.by("id")));
        var secondPage = jobService.getAllJobs(filter, PageRequest.of(1, 2, Sort.by("id")));
        var finalPage = jobService.getAllJobs(filter, PageRequest.of(2, 2, Sort.by("id")));
        var emptyPage = jobService.getAllJobs(filter, PageRequest.of(3, 2, Sort.by("id")));
        var largerPage = jobService.getAllJobs(filter, PageRequest.of(0, 3, Sort.by("id")));
        GetListJobReqDTO noMatchFilter = new GetListJobReqDTO();
        noMatchFilter.setName(prefix + " no match");
        var noMatchPage = jobService.getAllJobs(noMatchFilter, PageRequest.of(0, 2));

        assertEquals(2, firstPage.getResult().size());
        assertEquals(1, firstPage.getMeta().getPageNumber());
        assertEquals(5, firstPage.getMeta().getTotal());
        assertEquals(3, firstPage.getMeta().getPages());
        assertEquals(2, secondPage.getMeta().getPageNumber());
        assertEquals(2, secondPage.getResult().size());
        assertEquals(3, finalPage.getMeta().getPageNumber());
        assertEquals(1, finalPage.getResult().size());
        assertTrue(emptyPage.getResult().isEmpty());
        assertTrue(noMatchPage.getResult().isEmpty());
        assertEquals(3, largerPage.getResult().size());

        List<Long> ids = List.of(
                firstPage.getResult().get(0).getId(), firstPage.getResult().get(1).getId(),
                secondPage.getResult().get(0).getId(), secondPage.getResult().get(1).getId(),
                finalPage.getResult().get(0).getId());
        assertEquals(5, ids.stream().distinct().count());
        assertTrue(firstPage.getResult().get(0).getId() < firstPage.getResult().get(1).getId());
    }

    private CreateJobReqDTO createJobRequest(long companyId, long skillId) {
        CreateJobReqDTO request = new CreateJobReqDTO();
        request.setName("Employer job " + UUID.randomUUID());
        request.setDescription("Job creation integration test");
        request.setQuantity(1);
        request.setSalary(2000.0);
        request.setLevel(LevelEnum.MIDDLE);
        request.setJobType(JobTypeEnum.FULL_TIME);
        request.setStartDate(Instant.now());
        request.setEndDate(Instant.now().plusSeconds(86400));
        request.setCompanyId(companyId);
        request.setSkillIds(List.of(skillId));
        return request;
    }

    private UpdateJobReqDTO updateRequest(CreateJobReqDTO source, long jobId, Boolean active) {
        UpdateJobReqDTO request = new UpdateJobReqDTO();
        request.setId(jobId);
        request.setName(source.getName());
        request.setLocation(source.getLocation());
        request.setDescription(source.getDescription());
        request.setQuantity(source.getQuantity());
        request.setSalary(source.getSalary());
        request.setLevel(source.getLevel());
        request.setJobType(source.getJobType());
        request.setStartDate(source.getStartDate());
        request.setEndDate(source.getEndDate());
        request.setActive(active);
        request.setCompanyId(source.getCompanyId());
        request.setSkillIds(source.getSkillIds());
        return request;
    }

    private Skill saveSkill() {
        Skill skill = new Skill();
        skill.setName("Integration skill " + UUID.randomUUID());
        return skillRepository.saveAndFlush(skill);
    }

    private Company saveCompany(String label) {
        Company company = new Company();
        company.setName(label + " " + UUID.randomUUID());
        return companyRepository.saveAndFlush(company);
    }

    private User saveUser(String roleName, Company company) {
        Role role = roleRepository.findByName(roleName).orElseThrow();
        User user = new User();
        user.setName("Employer integration test");
        user.setEmail("employer-" + UUID.randomUUID() + "@example.test");
        user.setRole(role);
        user.setCompany(company);
        user.setVerified(true);
        return userRepository.saveAndFlush(user);
    }

    private void authenticate(User user) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(user.getEmail(), "test", List.of()));
    }
}
