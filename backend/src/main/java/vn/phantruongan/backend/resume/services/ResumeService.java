package vn.phantruongan.backend.resume.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.authentication.BadCredentialsException;
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
import vn.phantruongan.backend.util.error.PermissionDeniedException;

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
                User actor = currentActor();
                String roleName = roleName(actor);
                boolean employerScope = "EMPLOYER".equalsIgnoreCase(roleName);
                Long ownerUserId = isPrivilegedManager(roleName) ? null : actor.getId();
                Specification<Resume> spec = new ResumeSpecification(dto, ownerUserId, employerScope);
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
                User actor = currentActor();
                String roleName = roleName(actor);
                User user;
                boolean candidateSubmission;
                if (isPrivilegedManager(roleName)) {
                        user = dto.getUserId() == null ? actor : userRepository.findById(dto.getUserId())
                                        .orElseThrow(() -> new InvalidException("User not found with id: " + dto.getUserId()));
                        candidateSubmission = false;
                } else if ("CANDIDATE".equalsIgnoreCase(roleName)) {
                        // Ignore userId from the request for every candidate-facing call.
                        user = actor;
                        candidateSubmission = true;
                } else {
                        throw new PermissionDeniedException(
                                        "Only candidates or authorized administrators can create applications");
                }

                return saveResume(dto, user, candidateSubmission);
        }

        /** Candidate-facing creation: identity always comes from the authenticated account. */
        public ResumeResDTO createResumeForCurrentCandidate(CreateResumeReqDTO dto) throws InvalidException {
                User user = currentCandidate();
                return saveResume(dto, user, true);
        }

        private ResumeResDTO saveResume(CreateResumeReqDTO dto, User user, boolean candidateSubmission) {
                Job job = jobRepository.findById(dto.getJobId())
                                .orElseThrow(() -> new InvalidException("Job not found with id: " + dto.getJobId()));

                if (resumeRepository.existsByUserIdAndJobId(user.getId(), job.getId())) {
                        throw new InvalidException("Bạn đã ứng tuyển vào công việc này trước đó rồi.");
                }

                Resume resume = resumeMapper.toEntity(dto);
                resume.setUser(user);
                resume.setJob(job);
                if (candidateSubmission) {
                        resume.setStatus(ResumeEnum.PENDING);
                } else if (dto.getStatus() == null) {
                        resume.setStatus(ResumeEnum.PENDING);
                }
                if (dto.getNote() != null) {
                        resume.setNote(dto.getNote().trim());
                }

                Resume saved = resumeRepository.save(resume);
                return resumeMapper.toDto(saved);
        }

        public List<ResumeResDTO> getMyResumes() throws InvalidException {
                User user = currentCandidate();
                List<Resume> list = resumeRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
                return resumeMapper.toDtoList(list);
        }

        public ResumeResDTO checkApplied(long jobId) throws InvalidException {
                User user = currentCandidate();
                return resumeRepository.findByUserIdAndJobId(user.getId(), jobId)
                                .map(resumeMapper::toDto)
                                .orElse(null);
        }

        private User currentCandidate() {
                String email = currentUserService.getCurrentUserEmail();
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new BadCredentialsException(
                                                "Authenticated candidate account not found."));
                if (user.getRole() == null || !"CANDIDATE".equalsIgnoreCase(user.getRole().getName())) {
                        throw new PermissionDeniedException(
                                        "Only candidates can manage their applications");
                }
                return user;
        }

        private boolean isPrivilegedManager(String roleName) {
                return "ADMIN".equalsIgnoreCase(roleName) || "MANAGER".equalsIgnoreCase(roleName);
        }

        private User currentActor() {
                String email = currentUserService.getCurrentUserEmail();
                return userRepository.findByEmail(email)
                                .orElseThrow(() -> new BadCredentialsException("Authenticated user account not found."));
        }

        private String roleName(User user) {
                return user.getRole() == null ? "" : user.getRole().getName();
        }

        private void requireReviewManager(User actor) {
                String roleName = roleName(actor);
                if (!isPrivilegedManager(roleName) && !"EMPLOYER".equalsIgnoreCase(roleName)) {
                        throw new PermissionDeniedException(
                                        "Only employers or authorized administrators can review applications");
                }
        }

        private Resume findAccessibleResume(long id, User actor) {
                String roleName = roleName(actor);
                if (isPrivilegedManager(roleName)) {
                        return resumeRepository.findById(id)
                                        .orElseThrow(() -> new InvalidException("Resume not found with id: " + id));
                }
                if ("EMPLOYER".equalsIgnoreCase(roleName)) {
                        return resumeRepository.findByIdAndJob_Company_Users_Id(id, actor.getId())
                                        .orElseThrow(() -> new PermissionDeniedException(
                                                        "Resume is not associated with the employer's company"));
                }
                return resumeRepository.findByIdAndUser_Id(id, actor.getId())
                                .orElseThrow(() -> new PermissionDeniedException(
                                                "Resume does not belong to the current user"));
        }

        public ResumeResDTO findById(long id) throws InvalidException {
                Resume resume = findAccessibleResume(id, currentActor());
                return resumeMapper.toDto(resume);
        }

        public ResumeResDTO updateResume(UpdateResumeReqDTO dto) throws InvalidException {
                User actor = currentActor();
                String roleName = roleName(actor);
                boolean privileged = isPrivilegedManager(roleName);
                Resume existingResume = findAccessibleResume(dto.getId(), actor);
                User user = privileged && dto.getUserId() != null
                                ? userRepository.findById(dto.getUserId())
                                                .orElseThrow(() -> new InvalidException("User not found with id: " + dto.getUserId()))
                                : existingResume.getUser();
                Job job = privileged && dto.getJobId() != null
                                ? jobRepository.findById(dto.getJobId())
                                                .orElseThrow(() -> new InvalidException("Job not found with id: " + dto.getJobId()))
                                : existingResume.getJob();
                ResumeEnum originalStatus = existingResume.getStatus();
                resumeMapper.updateEntityFromDto(dto, existingResume);
                existingResume.setUser(user);
                existingResume.setJob(job);
                if (!privileged && !"EMPLOYER".equalsIgnoreCase(roleName)) {
                        existingResume.setStatus(originalStatus);
                }
                Resume updated = resumeRepository.save(existingResume);

                return resumeMapper.toDto(updated);
        }

        public boolean deleteResumeById(long id) throws InvalidException {
                if (id <= 0) {
                        throw new InvalidException("Resume ID must be a positive number.");
                }

                Resume resume = findAccessibleResume(id, currentActor());

                resumeRepository.delete(resume);
                return true;
        }

        public ResumeResDTO reviewResume(long id) throws InvalidException {
                String email = currentUserService.getCurrentUserEmail();
                User actor = currentActor();
                requireReviewManager(actor);
                Resume resume = findAccessibleResume(id, actor);

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
                User actor = currentActor();
                requireReviewManager(actor);
                Resume resume = findAccessibleResume(id, actor);

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
                User actor = currentActor();
                requireReviewManager(actor);
                Resume resume = findAccessibleResume(id, actor);

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
