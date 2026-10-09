package vn.phantruongan.backend.publics.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

import vn.phantruongan.backend.company.dtos.req.GetListCompanyReqDTO;
import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.company.entities.CompanyStatus;
import vn.phantruongan.backend.company.services.CompanyService;
import vn.phantruongan.backend.job.dtos.req.job.GetListJobReqDTO;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.job.services.JobService;
import vn.phantruongan.backend.publics.job.services.PublicJobService;
import vn.phantruongan.backend.util.error.InvalidException;
import vn.phantruongan.backend.company.repositories.CompanyRepository;
import vn.phantruongan.backend.job.repositories.JobRepository;

@SpringBootTest
@Transactional
class PublicListingVisibilityIntegrationTest {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private JobService jobService;

    @Autowired
    private PublicJobService publicJobService;

    @Test
    void publicJobSearchFiltersInactiveJobsAndUnapprovedCompaniesAndKeepsPagination() {
        String prefix = "Public visibility " + UUID.randomUUID();
        Company approved = saveCompany(prefix + " approved", CompanyStatus.APPROVED);
        Company pending = saveCompany(prefix + " pending", CompanyStatus.PENDING);
        Company checking = saveCompany(prefix + " checking", CompanyStatus.CHECKING);
        Company rejected = saveCompany(prefix + " rejected", CompanyStatus.REJECTED);
        Job visible = saveJob(prefix + " visible", approved, true);
        Job secondVisible = saveJob(prefix + " second visible", approved, true);
        saveJob(prefix + " inactive", approved, false);
        saveJob(prefix + " pending company", pending, true);
        saveJob(prefix + " checking company", checking, true);
        saveJob(prefix + " rejected company", rejected, true);

        GetListJobReqDTO filter = new GetListJobReqDTO();
        filter.setName(prefix);
        var page = jobService.getPublicJobs(filter, PageRequest.of(0, 1, Sort.by("id")));
        var secondPage = jobService.getPublicJobs(filter, PageRequest.of(1, 1, Sort.by("id")));

        assertEquals(1, page.getResult().size());
        assertEquals(visible.getId(), page.getResult().get(0).getId());
        assertEquals(1, page.getMeta().getPageNumber());
        assertEquals(1, page.getMeta().getPageSize());
        assertEquals(2, page.getMeta().getTotal());
        assertEquals(2, page.getMeta().getPages());
        assertEquals(2, secondPage.getMeta().getPageNumber());
        assertEquals(secondVisible.getId(), secondPage.getResult().get(0).getId());
    }

    @Test
    void publicJobDetailHidesInactiveAndUnapprovedJobsAsNotFound() {
        String prefix = "Public job detail " + UUID.randomUUID();
        Company approved = saveCompany(prefix + " approved", CompanyStatus.APPROVED);
        Company pending = saveCompany(prefix + " pending", CompanyStatus.PENDING);
        Company checking = saveCompany(prefix + " checking", CompanyStatus.CHECKING);
        Company rejected = saveCompany(prefix + " rejected", CompanyStatus.REJECTED);
        Job visible = saveJob(prefix + " visible", approved, true);
        Job inactive = saveJob(prefix + " inactive", approved, false);
        Job pendingCompany = saveJob(prefix + " pending", pending, true);
        Job checkingCompany = saveJob(prefix + " checking", checking, true);
        Job rejectedCompany = saveJob(prefix + " rejected", rejected, true);

        assertEquals(visible.getId(), jobService.findPublicById(visible.getId()).getId());
        assertThrows(InvalidException.class, () -> jobService.findPublicById(inactive.getId()));
        assertThrows(InvalidException.class, () -> jobService.findPublicById(pendingCompany.getId()));
        assertThrows(InvalidException.class, () -> jobService.findPublicById(checkingCompany.getId()));
        assertThrows(InvalidException.class, () -> jobService.findPublicById(rejectedCompany.getId()));
    }

    @Test
    void latestJobsUsesTheSameActiveAndApprovedVisibilityRule() {
        String prefix = "Latest visibility " + UUID.randomUUID();
        Company approved = saveCompany(prefix + " approved", CompanyStatus.APPROVED);
        Company pending = saveCompany(prefix + " pending", CompanyStatus.PENDING);
        Company rejected = saveCompany(prefix + " rejected", CompanyStatus.REJECTED);
        Job visible = saveJob(prefix + " visible", approved, true);
        Job inactive = saveJob(prefix + " inactive", approved, false);
        Job pendingCompany = saveJob(prefix + " pending company", pending, true);
        Job rejectedCompany = saveJob(prefix + " rejected company", rejected, true);

        // A unique limit avoids reusing an earlier cached latest-jobs result.
        int limit = 101 + Math.floorMod(prefix.hashCode(), 1000);
        var latest = publicJobService.getLatestJobs(limit);

        var latestJobIds = latest.stream().map(job -> job.getId()).toList();
        assertTrue(latestJobIds.contains(visible.getId()));
        assertFalse(latestJobIds.contains(inactive.getId()));
        assertFalse(latestJobIds.contains(pendingCompany.getId()));
        assertFalse(latestJobIds.contains(rejectedCompany.getId()));
    }

    @Test
    void publicCompanySearchAndDetailExposeOnlyApprovedCompanies() {
        String prefix = "Public company " + UUID.randomUUID();
        Company approved = saveCompany(prefix + " approved", CompanyStatus.APPROVED);
        Company secondApproved = saveCompany(prefix + " second approved", CompanyStatus.APPROVED);
        Company pending = saveCompany(prefix + " pending", CompanyStatus.PENDING);
        Company checking = saveCompany(prefix + " checking", CompanyStatus.CHECKING);
        Company rejected = saveCompany(prefix + " rejected", CompanyStatus.REJECTED);

        GetListCompanyReqDTO filter = new GetListCompanyReqDTO();
        filter.setName(prefix);
        var page = companyService.getPublicCompanies(filter, PageRequest.of(0, 1, Sort.by("id")));
        var secondPage = companyService.getPublicCompanies(filter, PageRequest.of(1, 1, Sort.by("id")));

        assertEquals(1, page.getResult().size());
        assertEquals(approved.getId(), page.getResult().get(0).getId());
        assertEquals(1, page.getMeta().getPageNumber());
        assertEquals(2, page.getMeta().getTotal());
        assertEquals(2, page.getMeta().getPages());
        assertEquals(2, secondPage.getMeta().getPageNumber());
        assertEquals(secondApproved.getId(), secondPage.getResult().get(0).getId());
        assertEquals(approved.getId(), companyService.findPublicById(approved.getId()).getId());
        assertThrows(InvalidException.class, () -> companyService.findPublicById(pending.getId()));
        assertThrows(InvalidException.class, () -> companyService.findPublicById(checking.getId()));
        assertThrows(InvalidException.class, () -> companyService.findPublicById(rejected.getId()));
    }

    @Test
    void managementQueriesRemainUnfilteredByPublicVisibility() {
        String prefix = "Management visibility " + UUID.randomUUID();
        Company pending = saveCompany(prefix + " pending", CompanyStatus.PENDING);
        Job inactive = saveJob(prefix + " inactive", pending, false);

        GetListJobReqDTO jobFilter = new GetListJobReqDTO();
        jobFilter.setName(prefix);
        var jobs = jobService.getAllJobs(jobFilter, PageRequest.of(0, 10, Sort.by("id")));

        GetListCompanyReqDTO companyFilter = new GetListCompanyReqDTO();
        companyFilter.setName(prefix);
        var companies = companyService.getAllCompanies(companyFilter, PageRequest.of(0, 10, Sort.by("id")));

        assertEquals(inactive.getId(), jobs.getResult().get(0).getId());
        assertEquals(1, companies.getResult().size());
        assertEquals(CompanyStatus.PENDING, companies.getResult().get(0).getStatus());
    }

    private Company saveCompany(String name, CompanyStatus status) {
        Company company = new Company();
        company.setName(name);
        company.setStatus(status);
        return companyRepository.saveAndFlush(company);
    }

    private Job saveJob(String name, Company company, boolean active) {
        Job job = new Job();
        job.setName(name);
        job.setCompany(company);
        job.setActive(active);
        return jobRepository.saveAndFlush(job);
    }
}
