package vn.phantruongan.backend.company.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.common.security.CurrentUserService;
import vn.phantruongan.backend.common.security.EmployerOwnershipService;
import vn.phantruongan.backend.company.dtos.req.UpdateCompanyReqDTO;
import vn.phantruongan.backend.company.dtos.res.CompanyResDTO;
import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.company.entities.CompanyStatus;
import vn.phantruongan.backend.company.mappers.CompanyMapper;
import vn.phantruongan.backend.company.repositories.CompanyRepository;
import vn.phantruongan.backend.company.repositories.CountryRepository;
import vn.phantruongan.backend.log.services.AuditLogService;
import vn.phantruongan.backend.resume.repositories.ResumeRepository;

@ExtendWith(MockitoExtension.class)
class CompanyServiceStatusTest {
    @Mock private CompanyRepository companyRepository;
    @Mock private CountryRepository countryRepository;
    @Mock private CompanyMapper companyMapper;
    @Mock private CurrentUserService currentUserService;
    @Mock private AuditLogService auditLogService;
    @Mock private EmployerOwnershipService ownershipService;
    @Mock private UserRepository userRepository;
    @Mock private ResumeRepository resumeRepository;

    @InjectMocks private CompanyService companyService;

    @Test
    void employerCannotChangeCompanyStatusThroughCraftedUpdateRequest() throws Exception {
        Company company = new Company();
        company.setId(17L);
        company.setName("Employer company");
        company.setStatus(CompanyStatus.APPROVED);
        UpdateCompanyReqDTO request = updateRequest(17L, CompanyStatus.REJECTED);

        when(currentUserService.getCurrentUserEmail()).thenReturn("employer@example.test");
        when(ownershipService.findCompanyForMutation(17L)).thenReturn(company);
        when(ownershipService.isEmployer()).thenReturn(true);
        when(companyRepository.save(company)).thenReturn(company);
        when(companyMapper.toDto(company)).thenReturn(new CompanyResDTO());
        doAnswer(invocation -> {
            UpdateCompanyReqDTO dto = invocation.getArgument(0);
            Company target = invocation.getArgument(1);
            target.setStatus(dto.getStatus());
            target.setName(dto.getName());
            return null;
        }).when(companyMapper).updateEntityFromDto(request, company);

        companyService.updateCompany(request);

        assertEquals(CompanyStatus.APPROVED, company.getStatus());
        assertEquals(request.getName(), company.getName());
    }

    @Test
    void nonEmployerStatusUpdateRemainsSupported() throws Exception {
        Company company = new Company();
        company.setId(23L);
        company.setStatus(CompanyStatus.PENDING);
        UpdateCompanyReqDTO request = updateRequest(23L, CompanyStatus.APPROVED);

        when(currentUserService.getCurrentUserEmail()).thenReturn("manager@example.test");
        when(ownershipService.findCompanyForMutation(23L)).thenReturn(company);
        when(ownershipService.isEmployer()).thenReturn(false);
        when(companyRepository.save(company)).thenReturn(company);
        when(companyMapper.toDto(company)).thenReturn(new CompanyResDTO());
        doAnswer(invocation -> {
            UpdateCompanyReqDTO dto = invocation.getArgument(0);
            Company target = invocation.getArgument(1);
            target.setStatus(dto.getStatus());
            return null;
        }).when(companyMapper).updateEntityFromDto(request, company);

        companyService.updateCompany(request);

        assertEquals(CompanyStatus.APPROVED, company.getStatus());
    }

    private UpdateCompanyReqDTO updateRequest(long id, CompanyStatus status) {
        UpdateCompanyReqDTO request = new UpdateCompanyReqDTO();
        request.setId(id);
        request.setName("Updated company");
        request.setStatus(status);
        return request;
    }
}
