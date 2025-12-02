package vn.phantruongan.backend.resume.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.common.security.CurrentUserService;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.job.repositories.JobRepository;
import vn.phantruongan.backend.log.services.AuditLogService;
import vn.phantruongan.backend.resume.dtos.req.CreateResumeReqDTO;
import vn.phantruongan.backend.resume.dtos.req.GetListResumeReqDTO;
import vn.phantruongan.backend.resume.dtos.req.UpdateResumeReqDTO;
import vn.phantruongan.backend.resume.dtos.res.ResumeResDTO;
import vn.phantruongan.backend.resume.entities.Resume;
import vn.phantruongan.backend.resume.enums.ResumeEnum;
import vn.phantruongan.backend.resume.mappers.ResumeMapper;
import vn.phantruongan.backend.resume.repositories.ResumeRepository;
import vn.phantruongan.backend.resume.specification.ResumeSpecification;
import vn.phantruongan.backend.util.error.InvalidException;

@Service
@RequiredArgsConstructor
public class ResumeService {

        private final ResumeRepository resumeRepository;
        private final ResumeMapper resumeMapper;
        private final UserRepository userRepository;
        private final JobRepository jobRepository;
        private final CurrentUserService currentUserService;
        private final AuditLogService auditLogService;

        public PaginationResponse<ResumeResDTO> getAllResumes(GetListResumeReqDTO dto, Pageable pageable) {
                Specification<Resume> spec = new ResumeSpecification(dto);
                Page<Resume> page = resumeRepository.findAll(spec, pageable);
                List<ResumeResDTO> list = resumeMapper.toDtoList(page.getContent());

                PaginationResponse.Meta meta = new PaginationResponse.Meta(
                                page.getNumber() + 1,
                                page.getSize(),
                                page.getTotalElements(),
                                page.getTotalPages());

                return new PaginationResponse<>(list, meta);
        }

        public ResumeResDTO createResume(CreateResumeReqDTO dto) throws InvalidException {
                Resume resume = resumeMapper.toEntity(dto);

                User user = userRepository.findById(dto.getUserId())
                                .orElseThrow(() -> new InvalidException("User not found with id: " + dto.getUserId()));
                Job job = jobRepository.findById(dto.getJobId())
                                .orElseThrow(() -> new InvalidException("Job not found with id: " + dto.getJobId()));

                resume.setUser(user);
                resume.setJob(job);

                Resume saved = resumeRepository.save(resume);
                return resumeMapper.toDto(saved);
        }

        public ResumeResDTO findById(long id) throws InvalidException {
                Resume resume = resumeRepository.findById(id)
                                .orElseThrow(() -> new InvalidException("Resume not found with id: " + id));

                return resumeMapper.toDto(resume);
        }

        public ResumeResDTO updateResume(UpdateResumeReqDTO dto) throws InvalidException {
                Resume existingResume = resumeRepository.findById(dto.getId())
                                .orElseThrow(() -> new InvalidException("Resume not found with id: " + dto.getId()));

                User user = userRepository.findById(dto.getUserId())
                                .orElseThrow(() -> new InvalidException("User not found with id: " + dto.getUserId()));
                Job job = jobRepository.findById(dto.getJobId())
                                .orElseThrow(() -> new InvalidException("Job not found with id: " + dto.getJobId()));

                existingResume.setUser(user);
                existingResume.setJob(job);

                resumeMapper.updateEntityFromDto(dto, existingResume);
                Resume updated = resumeRepository.save(existingResume);

                return resumeMapper.toDto(updated);
        }

        public boolean deleteResumeById(long id) throws InvalidException {
                if (id <= 0) {
                        throw new InvalidException("Resume ID must be a positive number.");
                }

                Resume resume = resumeRepository.findById(id)
                                .orElseThrow(() -> new InvalidException("Resume not found with id: " + id));

                resumeRepository.delete(resume);
                return true;
        }

        public ResumeResDTO reviewResume(long id) throws InvalidException {
                String email = currentUserService.getCurrentUserEmail();
                Resume resume = resumeRepository.findById(id)
                                .orElseThrow(() -> new InvalidException("Resume not found with id: " + id));

                if (resume.getStatus() != ResumeEnum.PENDING) {
                        throw new InvalidException("Only resumes in PENDING status can be moved to REVIEWING.");
                }

                resume.setStatus(ResumeEnum.REVIEWING);
                Resume saved = resumeRepository.save(resume);
                auditLogService.logReview(ResourceEnum.RESUME, email, saved.getId(), "Review resume");
                return resumeMapper.toDto(saved);
        }

        public ResumeResDTO approveResume(long id) throws InvalidException {
                String email = currentUserService.getCurrentUserEmail();
                Resume resume = resumeRepository.findById(id)
                                .orElseThrow(() -> new InvalidException("Resume not found with id: " + id));

                if (resume.getStatus() == ResumeEnum.APPROVED) {
                        throw new InvalidException("This resume has already been approved.");
                }

                resume.setStatus(ResumeEnum.APPROVED);
                Resume saved = resumeRepository.save(resume);
                auditLogService.logApprove(ResourceEnum.RESUME, email, saved.getId(), "Approve resume");
                return resumeMapper.toDto(saved);
        }

        public ResumeResDTO rejectResume(long id, String note) throws InvalidException {
                String email = currentUserService.getCurrentUserEmail();
                Resume resume = resumeRepository.findById(id)
                                .orElseThrow(() -> new InvalidException("Resume not found with id: " + id));

                if (resume.getStatus() == ResumeEnum.REJECTED) {
                        throw new InvalidException("This resume has already been rejected.");
                }

                resume.setStatus(ResumeEnum.REJECTED);
                if (note != null && !note.isBlank()) {
                        resume.setNote(note.trim());
                }

                Resume saved = resumeRepository.save(resume);
                auditLogService.logReject(ResourceEnum.RESUME, email, saved.getId(), "Reject resume");
                return resumeMapper.toDto(saved);
        }
}
