package vn.phantruongan.backend.common.security;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.company.repositories.CompanyRepository;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.job.repositories.JobRepository;
import vn.phantruongan.backend.util.error.InvalidException;
import vn.phantruongan.backend.util.error.PermissionDeniedException;

/** Backend ownership checks for employer-managed company and job resources. */
@Service
@RequiredArgsConstructor
public class EmployerOwnershipService {
    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;

    public boolean isEmployer() {
        User user = currentUser();
        return user.getRole() != null && "EMPLOYER".equalsIgnoreCase(user.getRole().getName());
    }

    public Company findCompanyForMutation(long companyId) {
        if (!isEmployer()) {
            return companyRepository.findById(companyId)
                    .orElseThrow(() -> new InvalidException("Company not found"));
        }
        return companyRepository.findByIdAndUsers_Id(companyId, currentUser().getId())
                .orElseThrow(() -> new PermissionDeniedException("Company is not owned by the current employer"));
    }

    public Job findJobForMutation(long jobId) {
        if (!isEmployer()) {
            return jobRepository.findById(jobId)
                    .orElseThrow(() -> new InvalidException("Job not found"));
        }
        Long companyId = employerCompanyId();
        return jobRepository.findByIdAndCompany_Id(jobId, companyId)
                .orElseThrow(() -> new PermissionDeniedException("Job is not owned by the current employer"));
    }

    public Company findEmployerCompany(long companyId) {
        return companyRepository.findByIdAndUsers_Id(companyId, currentUser().getId())
                .orElseThrow(() -> new PermissionDeniedException("Company is not owned by the current employer"));
    }

    public Long employerCompanyId() {
        User user = currentUser();
        if (user.getRole() == null || !"EMPLOYER".equalsIgnoreCase(user.getRole().getName())) {
            throw new PermissionDeniedException("Current user is not an employer");
        }
        if (user.getCompany() == null) {
            throw new PermissionDeniedException("Employer is not associated with a company");
        }
        return user.getCompany().getId();
    }

    public User currentUser() {
        String email = currentUserService.getCurrentUserEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new PermissionDeniedException("Authenticated user not found"));
    }
}
