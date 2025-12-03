package vn.phantruongan.backend.recommendation.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.job.entities.JobSkill;
import vn.phantruongan.backend.job.repositories.JobRepository;
import vn.phantruongan.backend.recommendation.entities.JobRecommendation;
import vn.phantruongan.backend.recommendation.enums.RecommendationStatus;
import vn.phantruongan.backend.recommendation.repositories.JobRecommendationRepository;
import vn.phantruongan.backend.subscriber.entities.Skill;
import vn.phantruongan.backend.subscriber.entities.Subscriber;
import vn.phantruongan.backend.subscriber.entities.SubscriberSkill;
import vn.phantruongan.backend.subscriber.repositories.SubscriberRepository;

@Service
@RequiredArgsConstructor
public class JobRecommendationService {

    private final JobRecommendationRepository jobRecommendationRepository;
    private final JobRepository jobRepository;
    private final SubscriberRepository subscriberRepository;

    @Transactional
    public void generateJobRecommendations() {
        List<Subscriber> subscribers = subscriberRepository.findAllWithSkills();
        List<Job> jobs = jobRepository.findAllWithSkills();

        List<JobRecommendation> toSave = new ArrayList<>();

        for (Subscriber subscriber : subscribers) {
            Set<Skill> subscriberSkills = subscriber.getSubscriberSkills()
                    .stream()
                    .map(SubscriberSkill::getSkill)
                    .collect(Collectors.toSet());

            for (Job job : jobs) {
                Set<Skill> jobSkills = job.getJobSkills()
                        .stream()
                        .map(JobSkill::getSkill)
                        .collect(Collectors.toSet());

                boolean hasMatch = subscriberSkills.stream().anyMatch(jobSkills::contains);

                if (hasMatch) {
                    boolean exists = jobRecommendationRepository.existsBySubscriber_IdAndJob_Id(subscriber.getId(),
                            job.getId());
                    if (!exists) {
                        JobRecommendation recommendation = new JobRecommendation();
                        recommendation.setSubscriber(subscriber);
                        recommendation.setJob(job);
                        recommendation.setStatus(RecommendationStatus.PENDING);
                        toSave.add(recommendation);
                    }
                }
            }
        }

        // Batch insert
        if (!toSave.isEmpty()) {
            jobRecommendationRepository.saveAll(toSave);
        }
    }
}
