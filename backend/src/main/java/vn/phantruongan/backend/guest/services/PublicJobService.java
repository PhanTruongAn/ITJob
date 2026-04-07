package vn.phantruongan.backend.guest.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.job.dtos.res.JobResDTO;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.job.mappers.JobMapper;
import vn.phantruongan.backend.job.repositories.JobRepository;

@Service
@RequiredArgsConstructor
public class PublicJobService {
    private final JobRepository jobRepository;
    private final JobMapper jobMapper;

    public List<JobResDTO> getLatestJobs(int limit) {
        Pageable pageable = PageRequest.of(
                0,
                limit,
                Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Job> page = jobRepository.findByIsActive(true, pageable);

        return jobMapper.toDtoList(page.getContent());
    }
}
