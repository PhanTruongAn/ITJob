package vn.phantruongan.backend.recommendation.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;

import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.authorization.entities.Role;
import vn.phantruongan.backend.common.security.CurrentUserService;
import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.job.enums.JobTypeEnum;
import vn.phantruongan.backend.recommendation.entities.JobRecommendation;
import vn.phantruongan.backend.recommendation.repositories.JobRecommendationRepository;
import vn.phantruongan.backend.subscriber.entities.Subscriber;
import vn.phantruongan.backend.subscriber.repositories.SubscriberRepository;

@ExtendWith(MockitoExtension.class)
class CandidateRecommendationServiceTest {
    @Mock CurrentUserService currentUserService;
    @Mock UserRepository userRepository;
    @Mock SubscriberRepository subscriberRepository;
    @Mock JobRecommendationRepository recommendationRepository;
    @Mock ObjectMapper objectMapper;

    @InjectMocks CandidateRecommendationService service;

    private User candidate;
    private Subscriber subscriber;

    @BeforeEach
    void setUp() {
        Role role = new Role();
        role.setName("CANDIDATE");
        candidate = new User();
        candidate.setId(22L);
        candidate.setEmail("Candidate@Example.test ");
        candidate.setVerified(true);
        candidate.setRole(role);

        subscriber = new Subscriber();
        subscriber.setId(42L);
        subscriber.setEmail("candidate@example.test");
    }

    @Test
    void returnsOnlyCurrentCandidatesRecommendationsWithJobAndCompanyData() {
        Job job = new Job();
        job.setId(12L);
        job.setName("Java Developer");
        job.setLocation("Hanoi");
        job.setSalary(2500.0);
        job.setJobType(JobTypeEnum.FULL_TIME);
        job.setActive(true);
        Company company = new Company();
        company.setName("Example Co");
        company.setLogo("https://example.test/logo.png");
        job.setCompany(company);

        JobRecommendation recommendation = new JobRecommendation();
        recommendation.setId(3L);
        recommendation.setJob(job);
        recommendation.setMatchScore(82.5);
        recommendation.setMatchedSkills("[\"Java\",\"Spring\"]");
        recommendation.setCreatedAt(Instant.parse("2026-09-01T10:00:00Z"));

        when(currentUserService.getCurrentUserEmail()).thenReturn("candidate@example.test");
        when(userRepository.findByEmail("candidate@example.test")).thenReturn(Optional.of(candidate));
        when(subscriberRepository.findByEmail("candidate@example.test")).thenReturn(Optional.of(subscriber));
        when(recommendationRepository.findCandidateVisibleBySubscriberId(eq(42L), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(recommendation), PageRequest.of(0, 6), 1));

        var response = service.getCurrentCandidateRecommendations(PageRequest.of(0, 6));

        assertEquals(1, response.getResult().size());
        assertEquals("Java Developer", response.getResult().get(0).getJobTitle());
        assertEquals("Example Co", response.getResult().get(0).getCompanyName());
        assertEquals(12L, response.getResult().get(0).getJobId());
        assertEquals(82.5, response.getResult().get(0).getMatchScore());
        assertEquals(1, response.getMeta().getTotal());
        verify(recommendationRepository).findCandidateVisibleBySubscriberId(eq(42L), any(Pageable.class));
    }

    @Test
    void doesNotAcceptClientSelectedUserOrSubscriberIdentityAndBoundsPageSize() {
        when(currentUserService.getCurrentUserEmail()).thenReturn("candidate@example.test");
        when(userRepository.findByEmail("candidate@example.test")).thenReturn(Optional.of(candidate));
        when(subscriberRepository.findByEmail("candidate@example.test")).thenReturn(Optional.of(subscriber));
        when(recommendationRepository.findCandidateVisibleBySubscriberId(eq(42L), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(), PageRequest.of(0, 50), 0));

        service.getCurrentCandidateRecommendations(PageRequest.of(0, 200));

        ArgumentCaptor<Pageable> pageable = ArgumentCaptor.forClass(Pageable.class);
        verify(recommendationRepository).findCandidateVisibleBySubscriberId(eq(42L), pageable.capture());
        assertEquals(50, pageable.getValue().getPageSize());
        assertEquals("createdAt: DESC,id: DESC", pageable.getValue().getSort().toString());
    }

    @Test
    void candidateWithoutMatchingSubscriberGetsAnEmptyPage() {
        when(currentUserService.getCurrentUserEmail()).thenReturn("candidate@example.test");
        when(userRepository.findByEmail("candidate@example.test")).thenReturn(Optional.of(candidate));
        when(subscriberRepository.findByEmail("candidate@example.test")).thenReturn(Optional.empty());

        var response = service.getCurrentCandidateRecommendations(PageRequest.of(0, 6));

        assertEquals(List.of(), response.getResult());
        assertEquals(0, response.getMeta().getTotal());
        verify(recommendationRepository, never()).findCandidateVisibleBySubscriberId(any(), any());
    }

    @Test
    void nonCandidateCannotReadCandidateRecommendations() {
        candidate.getRole().setName("EMPLOYER");
        when(currentUserService.getCurrentUserEmail()).thenReturn("candidate@example.test");
        when(userRepository.findByEmail("candidate@example.test")).thenReturn(Optional.of(candidate));

        assertThrows(AccessDeniedException.class,
                () -> service.getCurrentCandidateRecommendations(PageRequest.of(0, 6)));

        verify(subscriberRepository, never()).findByEmail(any());
    }

    @Test
    void unverifiedCandidateCannotClaimEmailBasedSubscriberRecommendations() {
        candidate.setVerified(false);
        when(currentUserService.getCurrentUserEmail()).thenReturn("candidate@example.test");
        when(userRepository.findByEmail("candidate@example.test")).thenReturn(Optional.of(candidate));

        assertThrows(AccessDeniedException.class,
                () -> service.getCurrentCandidateRecommendations(PageRequest.of(0, 6)));

        verify(subscriberRepository, never()).findByEmail(any());
    }

    @Test
    void missingAuthenticatedAccountIsRejected() {
        when(currentUserService.getCurrentUserEmail()).thenReturn("candidate@example.test");
        when(userRepository.findByEmail("candidate@example.test")).thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class,
                () -> service.getCurrentCandidateRecommendations(PageRequest.of(0, 6)));
    }
}
