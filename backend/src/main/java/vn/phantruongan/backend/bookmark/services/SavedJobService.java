package vn.phantruongan.backend.bookmark.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.bookmark.dtos.req.SaveJobReqDTO;
import vn.phantruongan.backend.bookmark.dtos.res.SavedJobResDTO;
import vn.phantruongan.backend.bookmark.entities.SavedJob;
import vn.phantruongan.backend.bookmark.mappers.SavedJobMapper;
import vn.phantruongan.backend.bookmark.repositories.SavedJobRepository;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.common.security.CurrentUserService;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.job.repositories.JobRepository;
import vn.phantruongan.backend.util.error.InvalidException;

@Service
@RequiredArgsConstructor
public class SavedJobService {
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final SavedJobRepository savedJobRepository;
    private final SavedJobMapper savedJobMapper;
    private final CurrentUserService currentUserService;

    // Get list saved jobs by candidate
    public PaginationResponse<SavedJobResDTO> getSavedJobsByCandidate(Pageable pageable) {
        User candidate = userRepository.findByEmail(currentUserService.getCurrentUserEmail())
                .orElseThrow(() -> new InvalidException("User not found"));

        Page<SavedJob> page = savedJobRepository.findByCandidateId(candidate.getId(), pageable);

        List<SavedJobResDTO> list = savedJobMapper.toDtoList(page.getContent());

        PaginationResponse.Meta meta = new PaginationResponse.Meta(
                page.getNumber() + 1,
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());

        return new PaginationResponse<>(list, meta);
    }

    // Save job
    public SavedJobResDTO saveJob(SaveJobReqDTO dto) {
        User candidate = userRepository.findByEmail(currentUserService.getCurrentUserEmail())
                .orElseThrow(() -> new InvalidException("User not found"));

        Job job = jobRepository.findById(dto.getJobId())
                .orElseThrow(() -> new InvalidException("Job not found"));
        SavedJob savedJob = new SavedJob();
        savedJob.setJob(job);
        savedJob.setCandidate(candidate);
        savedJobRepository.save(savedJob);
        return savedJobMapper.toDto(savedJob);
    }

    // Unsave job
    public void unsaveJob(Long savedJobId) {
        SavedJob savedJob = savedJobRepository.findById(savedJobId)
                .orElseThrow(() -> new InvalidException("Saved job not found"));
        savedJobRepository.delete(savedJob);
    }

}