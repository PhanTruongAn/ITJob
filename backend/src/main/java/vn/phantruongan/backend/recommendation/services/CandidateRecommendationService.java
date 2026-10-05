package vn.phantruongan.backend.recommendation.services;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.authorization.entities.Role;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.common.security.CurrentUserService;
import vn.phantruongan.backend.recommendation.dtos.res.CandidateRecommendationResDTO;
import vn.phantruongan.backend.recommendation.entities.JobRecommendation;
import vn.phantruongan.backend.recommendation.repositories.JobRecommendationRepository;
import vn.phantruongan.backend.subscriber.entities.Subscriber;
import vn.phantruongan.backend.subscriber.repositories.SubscriberRepository;

@Service
@RequiredArgsConstructor
public class CandidateRecommendationService {
    private static final int MAX_PAGE_SIZE = 50;
    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;
    private final SubscriberRepository subscriberRepository;
    private final JobRecommendationRepository jobRecommendationRepository;
    private final ObjectMapper objectMapper;

    public PaginationResponse<CandidateRecommendationResDTO> getCurrentCandidateRecommendations(
            Pageable pageable) {
        String authenticatedEmail = currentUserService.getCurrentUserEmail();
        User candidate = userRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() -> new BadCredentialsException("Authenticated user no longer exists"));

        Role role = candidate.getRole();
        if (role == null || !"CANDIDATE".equalsIgnoreCase(role.getName())) {
            throw new AccessDeniedException("Only candidates can view candidate recommendations");
        }
        if (!candidate.isVerified()) {
            throw new AccessDeniedException("Verify your email before viewing candidate recommendations");
        }

        if (candidate.getEmail() == null || candidate.getEmail().isBlank()) {
            throw new BadCredentialsException("Authenticated candidate has no verified email");
        }
        String subscriberEmail = candidate.getEmail().trim().toLowerCase(Locale.ROOT);
        Pageable boundedPageable = PageRequest.of(
                pageable.getPageNumber(),
                Math.min(Math.max(pageable.getPageSize(), 1), MAX_PAGE_SIZE),
                Sort.by(Sort.Order.desc("createdAt"), Sort.Order.desc("id")));
        Optional<Subscriber> subscriber = subscriberRepository.findByEmail(subscriberEmail);
        Page<JobRecommendation> page = subscriber
                .map(value -> jobRecommendationRepository.findCandidateVisibleBySubscriberId(value.getId(), boundedPageable))
                .orElseGet(() -> Page.empty(boundedPageable));

        List<CandidateRecommendationResDTO> recommendations = page.getContent().stream()
                .map(this::toCandidateDto)
                .collect(Collectors.toList());
        PaginationResponse.Meta meta = new PaginationResponse.Meta(
                page.getNumber() + 1,
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());

        return new PaginationResponse<>(recommendations, meta);
    }

    private CandidateRecommendationResDTO toCandidateDto(JobRecommendation recommendation) {
        var job = recommendation.getJob();
        var company = job.getCompany();
        return CandidateRecommendationResDTO.builder()
                .id(recommendation.getId())
                .jobId(job.getId())
                .jobTitle(job.getName())
                .companyName(company != null ? company.getName() : null)
                .companyLogo(company != null ? company.getLogo() : null)
                .location(job.getLocation())
                .salary(job.getSalary())
                .jobType(job.getJobType())
                .level(job.getLevel())
                .matchScore(recommendation.getMatchScore())
                .matchedSkills(parseMatchedSkills(recommendation.getMatchedSkills()))
                .createdAt(recommendation.getCreatedAt())
                .build();
    }

    private List<String> parseMatchedSkills(String matchedSkills) {
        if (matchedSkills == null || matchedSkills.isBlank()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(matchedSkills, new TypeReference<>() {});
        } catch (JsonProcessingException e) {
            return Arrays.stream(matchedSkills.replaceAll("[\\[\\]\"]", "").split(","))
                    .map(String::trim)
                    .filter(skill -> !skill.isEmpty())
                    .toList();
        }
    }
}
