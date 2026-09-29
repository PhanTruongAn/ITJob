package vn.phantruongan.backend.common.security;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
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
import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.company.repositories.CompanyRepository;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.job.repositories.JobRepository;

@ExtendWith(MockitoExtension.class)
class EmployerOwnershipServiceTest {
    @Mock CurrentUserService currentUserService;
    @Mock UserRepository userRepository;
    @Mock CompanyRepository companyRepository;
    @Mock JobRepository jobRepository;
    @InjectMocks EmployerOwnershipService service;

    @Test
    void employerCanResolveOnlyTheirCompanyAndJobs() {
        User employer = employer(12L, 34L);
        Company company = new Company();
        Job job = new Job();
        when(currentUserService.getCurrentUserEmail()).thenReturn("employer@example.test");
        when(userRepository.findByEmail("employer@example.test")).thenReturn(Optional.of(employer));
        when(companyRepository.findByIdAndUsers_Id(34L, 12L)).thenReturn(Optional.of(company));
        when(jobRepository.findByIdAndCompany_Id(56L, 34L)).thenReturn(Optional.of(job));

        assertSame(company, service.findCompanyForMutation(34L));
        assertSame(job, service.findJobForMutation(56L));
        verify(jobRepository).findByIdAndCompany_Id(56L, 34L);
    }

    @Test
    void employerCannotResolveAnotherCompanyOrItsJob() {
        User employer = employer(12L, 34L);
        when(currentUserService.getCurrentUserEmail()).thenReturn("employer@example.test");
        when(userRepository.findByEmail("employer@example.test")).thenReturn(Optional.of(employer));
        when(companyRepository.findByIdAndUsers_Id(99L, 12L)).thenReturn(Optional.empty());
        when(jobRepository.findByIdAndCompany_Id(56L, 34L)).thenReturn(Optional.empty());

        assertThrows(AccessDeniedException.class, () -> service.findCompanyForMutation(99L));
        assertThrows(AccessDeniedException.class, () -> service.findJobForMutation(56L));
    }

    @Test
    void managerKeepsUnrestrictedAccessWithinExistingPermissionPolicy() {
        User manager = new User();
        Role role = new Role();
        role.setName("MANAGER");
        manager.setRole(role);
        Company company = new Company();
        Job job = new Job();
        when(currentUserService.getCurrentUserEmail()).thenReturn("manager@example.test");
        when(userRepository.findByEmail("manager@example.test")).thenReturn(Optional.of(manager));
        when(companyRepository.findById(99L)).thenReturn(Optional.of(company));
        when(jobRepository.findById(56L)).thenReturn(Optional.of(job));

        assertSame(company, service.findCompanyForMutation(99L));
        assertSame(job, service.findJobForMutation(56L));
    }

    private User employer(long userId, long companyId) {
        Role role = new Role();
        role.setName("EMPLOYER");
        Company company = new Company();
        company.setId(companyId);
        User user = new User();
        user.setId(userId);
        user.setRole(role);
        user.setCompany(company);
        return user;
    }
}
