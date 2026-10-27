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
import vn.phantruongan.backend.recommendation.dtos.req.GetJobRecommendationReqDTO;
import vn.phantruongan.backend.recommendation.entities.JobRecommendation;
import vn.phantruongan.backend.recommendation.enums.EmailStatus;
import vn.phantruongan.backend.recommendation.specification.JobRecommendationSpecification;
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

    @Test
    void managementEmailStatusFilterUsesEmailDeliveryStatus() {
        String suffix = UUID.randomUUID().toString();
        Company company = saveCompany("Email status company " + suffix, CompanyStatus.APPROVED);
        Job sentJob = saveActiveJob("Sent job " + suffix, company);
        Job pendingJob = saveActiveJob("Pending job " + suffix, company);
        Subscriber subscriber = new Subscriber();
        subscriber.setEmail("email-status-" + suffix + "@example.test");
        subscriber = subscriberRepository.saveAndFlush(subscriber);

        JobRecommendation sent = saveRecommendation(subscriber, sentJob);
        sent.setEmailStatus(EmailStatus.SENT);
        recommendationRepository.saveAndFlush(sent);
        saveRecommendation(subscriber, pendingJob);

        GetJobRecommendationReqDTO filter = new GetJobRecommendationReqDTO();
        filter.setEmailStatus(EmailStatus.SENT);
        filter.setSubscriberId(subscriber.getId());
        var results = recommendationRepository.findAll(
                new JobRecommendationSpecification(filter));

        assertEquals(1, results.size());
        assertEquals(sent.getId(), results.get(0).getId());
        assertEquals(EmailStatus.SENT, results.get(0).getEmailStatus());
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

    private JobRecommendation saveRecommendation(Subscriber subscriber, Job job) {
        JobRecommendation recommendation = new JobRecommendation();
        recommendation.setSubscriber(subscriber);
        recommendation.setJob(job);
        return recommendationRepository.saveAndFlush(recommendation);
    }
}
