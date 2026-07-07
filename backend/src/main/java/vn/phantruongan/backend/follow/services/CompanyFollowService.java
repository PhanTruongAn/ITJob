package vn.phantruongan.backend.follow.services;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.common.security.CurrentUserService;
import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.company.repositories.CompanyRepository;
import vn.phantruongan.backend.follow.dtos.res.CompanyFollowResDTO;
import vn.phantruongan.backend.follow.entities.CompanyFollow;
import vn.phantruongan.backend.follow.repositories.CompanyFollowRepository;
import vn.phantruongan.backend.util.error.InvalidException;

@Service
@RequiredArgsConstructor
public class CompanyFollowService {

    private final CompanyFollowRepository companyFollowRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final CurrentUserService currentUserService;

    @Transactional
    public CompanyFollowResDTO toggleFollow(Long companyId) {
        String email = currentUserService.getCurrentUserEmail();
        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidException("User not found with email: " + email));

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new InvalidException("Company not found with ID: " + companyId));

        Optional<CompanyFollow> existingFollowOpt = companyFollowRepository
                .findByCandidateEmailAndCompanyId(email, companyId);

        CompanyFollow follow;
        if (existingFollowOpt.isPresent()) {
            follow = existingFollowOpt.get();
            follow.setActive(!follow.isActive());
        } else {
            follow = new CompanyFollow();
            follow.setCandidate(candidate);
            follow.setCompany(company);
            follow.setActive(true);
        }

        CompanyFollow saved = companyFollowRepository.save(follow);
        return mapToDTO(saved);
    }

    public boolean isFollowing(Long companyId) {
        String email = currentUserService.getCurrentUserEmail();
        if ("SYSTEM".equalsIgnoreCase(email) || email == null || email.isBlank()) {
            return false;
        }
        return companyFollowRepository.existsBySubscriberEmailAndCompanyId(email, companyId);
    }

    public PaginationResponse<CompanyFollowResDTO> getFollowedCompanies(Pageable pageable) {
        String email = currentUserService.getCurrentUserEmail();
        Page<CompanyFollow> page = companyFollowRepository.findByCandidateEmailAndActiveTrue(email, pageable);

        List<CompanyFollowResDTO> list = page.getContent().stream()
                .map(this::mapToDTO)
                .toList();

        PaginationResponse.Meta meta = new PaginationResponse.Meta(
                page.getNumber() + 1,
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());

        return new PaginationResponse<>(list, meta);
    }

    private CompanyFollowResDTO mapToDTO(CompanyFollow follow) {
        return CompanyFollowResDTO.builder()
                .id(follow.getId())
                .companyId(follow.getCompany().getId())
                .companyName(follow.getCompany().getName())
                .companyLogo(follow.getCompany().getLogo())
                .active(follow.isActive())
                .build();
    }
}
