package vn.phantruongan.backend.bookmark.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.bookmark.dtos.req.SaveCompanyReqDTO;
import vn.phantruongan.backend.bookmark.dtos.res.SavedCompanyResDTO;
import vn.phantruongan.backend.bookmark.entities.SavedCompany;
import vn.phantruongan.backend.bookmark.mappers.SavedCompanyMapper;
import vn.phantruongan.backend.bookmark.repositories.SavedCompanyRepository;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.common.security.CurrentUserService;
import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.company.repositories.CompanyRepository;
import vn.phantruongan.backend.util.error.InvalidException;

@Service
@RequiredArgsConstructor
public class SavedCompanyService {
    private final SavedCompanyRepository savedCompanyRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final CurrentUserService currentUserService;
    private final SavedCompanyMapper savedCompanyMapper;

    // Get list saved companies by candidate
    public PaginationResponse<SavedCompanyResDTO> getSavedCompaniesByCandidate(Pageable pageable) {
        User candidate = userRepository.findByEmail(currentUserService.getCurrentUserEmail())
                .orElseThrow(() -> new InvalidException("User not found"));

        Page<SavedCompany> page = savedCompanyRepository.findByCandidateId(candidate.getId(), pageable);

        List<SavedCompanyResDTO> list = savedCompanyMapper.toDtoList(page.getContent());

        PaginationResponse.Meta meta = new PaginationResponse.Meta(
                page.getNumber() + 1,
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());

        return new PaginationResponse<>(list, meta);
    }

    // Save company
    public SavedCompanyResDTO saveCompany(SaveCompanyReqDTO dto) {

        User candidate = userRepository.findByEmail(currentUserService.getCurrentUserEmail())
                .orElseThrow(() -> new InvalidException("User not found"));

        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new InvalidException("Company not found"));

        SavedCompany savedCompany = new SavedCompany();
        savedCompany.setCandidate(candidate);
        savedCompany.setCompany(company);

        savedCompanyRepository.save(savedCompany);
        return savedCompanyMapper.toDto(savedCompany);
    }

    // Unsave company
    public void unsaveCompany(Long savedCompanyId) {
        SavedCompany savedCompany = savedCompanyRepository.findById(savedCompanyId)
                .orElseThrow(() -> new InvalidException("Saved company not found"));
        savedCompanyRepository.delete(savedCompany);
    }

}
