package vn.phantruongan.backend.recommendation.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.company.entities.CompanyStatus;
import vn.phantruongan.backend.company.repositories.CompanyRepository;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.job.repositories.JobRepository;
import vn.phantruongan.backend.recommendation.entities.JobRecommendation;
import vn.phantruongan.backend.subscriber.entities.Subscriber;
import vn.phantruongan.backend.subscriber.repositories.SubscriberRepository;

@SpringBootTest
@Transactional
class CandidateRecommendationVisibilityIntegrationTest {
    @Autowired private CompanyRepository companyRepository;
    @Autowired private JobRepository jobRepository;
    @Autowired private SubscriberRepository subscriberRepository;
    @Autowired private JobRecommendationRepository recommendationRepository;

    @Test
    void candidateRecommendationsExcludeJobsFromUnapprovedCompanies() {
        String suffix = UUID.randomUUID().toString();
        Company approvedCompany = saveCompany("Approved " + suffix, CompanyStatus.APPROVED);
        Company pendingCompany = saveCompany("Pending " + suffix, CompanyStatus.PENDING);
        Job approvedJob = saveActiveJob("Approved job " + suffix, approvedCompany);
        Job pendingJob = saveActiveJob("Pending job " + suffix, pendingCompany);
        Subscriber subscriber = new Subscriber();
        subscriber.setEmail("candidate-" + suffix + "@example.test");
        subscriber = subscriberRepository.saveAndFlush(subscriber);
        saveRecommendation(subscriber, approvedJob);
        saveRecommendation(subscriber, pendingJob);

        var page = recommendationRepository.findCandidateVisibleBySubscriberId(
                subscriber.getId(), CompanyStatus.APPROVED, PageRequest.of(0, 10));

        assertEquals(1, page.getTotalElements());
        assertEquals(1, page.getContent().size());
        assertEquals(approvedJob.getId(), page.getContent().get(0).getJob().getId());
        assertTrue(page.getContent().stream()
                .allMatch(recommendation -> recommendation.getJob().getCompany().getStatus() == CompanyStatus.APPROVED));
    }

    private Company saveCompany(String name, CompanyStatus status) {
        Company company = new Company();
        company.setName(name);
        company.setStatus(status);
        return companyRepository.saveAndFlush(company);
    }

    private Job saveActiveJob(String name, Company company) {
        Job job = new Job();
        job.setName(name);
        job.setCompany(company);
        job.setActive(true);
        return jobRepository.saveAndFlush(job);
    }

    private void saveRecommendation(Subscriber subscriber, Job job) {
        JobRecommendation recommendation = new JobRecommendation();
        recommendation.setSubscriber(subscriber);
        recommendation.setJob(job);
        recommendationRepository.saveAndFlush(recommendation);
    }
}
