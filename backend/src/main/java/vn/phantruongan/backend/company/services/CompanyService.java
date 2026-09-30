package vn.phantruongan.backend.company.services;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.common.security.CurrentUserService;
import vn.phantruongan.backend.common.security.EmployerOwnershipService;
import vn.phantruongan.backend.company.dtos.req.CreateCompanyReqDTO;
import vn.phantruongan.backend.company.dtos.req.GetListCompanyReqDTO;
import vn.phantruongan.backend.company.dtos.req.UpdateCompanyReqDTO;
import vn.phantruongan.backend.company.dtos.res.CompanyResDTO;
import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.company.entities.CompanyStatus;
import vn.phantruongan.backend.company.entities.Country;
import vn.phantruongan.backend.company.mappers.CompanyMapper;
import vn.phantruongan.backend.company.repositories.CompanyRepository;
import vn.phantruongan.backend.company.repositories.CountryRepository;
import vn.phantruongan.backend.company.specification.CompanySpecification;
import vn.phantruongan.backend.log.services.AuditLogService;
import vn.phantruongan.backend.util.error.InvalidException;
import vn.phantruongan.backend.util.error.PermissionDeniedException;

@Service
@RequiredArgsConstructor
public class CompanyService {
    private final CompanyRepository companyRepository;
    private final CountryRepository countryRepository;
    private final CompanyMapper companyMapper;
    private final CurrentUserService currentUserService;
    private final AuditLogService auditLogService;
    private final EmployerOwnershipService ownershipService;
    private final UserRepository userRepository;

    public boolean isExistCompany(String name, long countryId) {
        if (companyRepository.existsByNameAndCountry_Id(name, countryId)) {
            return true;
        }
        return false;
    }

    @CacheEvict(cacheNames = "companies", allEntries = true)
    @Transactional
    public CompanyResDTO createCompany(CreateCompanyReqDTO dto) throws InvalidException {
        String email = currentUserService.getCurrentUserEmail();
        Company company = companyMapper.toEntity(dto);

        if (isExistCompany(dto.getName(), dto.getCountryId())) {
            throw new InvalidException(
                    "The company already exists in this country!");
        }
        Country country = countryRepository.findById(dto.getCountryId())
                .orElseThrow(() -> new InvalidException("Country not found"));
        company.setCountry(country);
        Company savedCompany = companyRepository.save(company);
        if (ownershipService.isEmployer()) {
            var user = ownershipService.currentUser();
            if (user.getCompany() != null) {
                throw new InvalidException("Employer is already associated with a company");
            }
            user.setCompany(savedCompany);
            userRepository.save(user);
        }
        auditLogService.logCreate(ResourceEnum.COMPANY, email, savedCompany.getId(), "Register company");
        return companyMapper.toDto(savedCompany);
    }

    @Cacheable(cacheNames = "companyDetails", key = "#id")
    public CompanyResDTO findById(long id) throws InvalidException {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Company not found with id: " + id));

        return companyMapper.toDto(company);
    }

    public CompanyResDTO findCompanyForManagement(long id) throws InvalidException {
        Company company = ownershipService.findCompanyForMutation(id);
        return companyMapper.toDto(company);
    }

    @CacheEvict(cacheNames = { "companyDetails", "companies" }, key = "#dto.id", allEntries = true)
    public CompanyResDTO updateCompany(UpdateCompanyReqDTO dto) throws InvalidException {
        String email = currentUserService.getCurrentUserEmail();
        Company existingCompany = ownershipService.findCompanyForMutation(dto.getId());
        boolean employer = ownershipService.isEmployer();
        CompanyStatus currentStatus = existingCompany.getStatus();

        companyMapper.updateEntityFromDto(dto, existingCompany);
        if (employer) {
            // Company verification status is controlled by the existing admin/manager workflow.
            existingCompany.setStatus(currentStatus);
        }
        Company companyUpdated = companyRepository.save(existingCompany);
        auditLogService.logUpdate(ResourceEnum.COMPANY, email, companyUpdated.getId(), "Update company");
        return companyMapper.toDto(companyUpdated);

    }

    public PaginationResponse<CompanyResDTO> getAllCompanies(GetListCompanyReqDTO dto, Pageable pageable) {
        return getAllCompanies(dto, pageable, null);
    }

    public PaginationResponse<CompanyResDTO> getCompaniesForManagement(GetListCompanyReqDTO dto, Pageable pageable) {
        Long ownerUserId = ownershipService.isEmployer() ? ownershipService.currentUser().getId() : null;
        return getAllCompanies(dto, pageable, ownerUserId);
    }

    private PaginationResponse<CompanyResDTO> getAllCompanies(GetListCompanyReqDTO dto, Pageable pageable,
            Long ownerUserId) {
        Specification<Company> spec = new CompanySpecification(dto, ownerUserId);
        Page<Company> page = companyRepository.findAll(spec, pageable);
        List<CompanyResDTO> list = companyMapper.toDtoList(page.getContent());

        PaginationResponse.Meta meta = new PaginationResponse.Meta(
                page.getNumber() + 1,
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());

        return new PaginationResponse<>(list, meta);
    }

    @CacheEvict(cacheNames = { "companyDetails", "companies" }, key = "#id", allEntries = true)
    public boolean deleteCompanyById(long id) throws InvalidException {
        String email = currentUserService.getCurrentUserEmail();
        if (id <= 0) {
            throw new InvalidException("Company ID must be a positive number.");
        }

        if (ownershipService.isEmployer()) {
            // Company deletion cascades to associated users and jobs in the current JPA
            // mapping.
            throw new PermissionDeniedException(
                    "Employers cannot delete companies");
        }
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Company not found."));

        companyRepository.delete(company);
        auditLogService.logDelete(ResourceEnum.COMPANY, email, id, "Delete company");
        return true;
    }

}
