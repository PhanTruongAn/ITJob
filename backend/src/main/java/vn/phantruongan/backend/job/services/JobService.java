package vn.phantruongan.backend.job.services;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.company.repositories.CompanyRepository;
import vn.phantruongan.backend.job.dtos.req.job.CreateJobReqDTO;
import vn.phantruongan.backend.job.dtos.req.job.GetListJobReqDTO;
import vn.phantruongan.backend.job.dtos.req.job.UpdateJobReqDTO;
import vn.phantruongan.backend.job.dtos.res.JobResDTO;
import vn.phantruongan.backend.job.entities.Job;
import vn.phantruongan.backend.job.entities.JobSkill;
import vn.phantruongan.backend.job.mappers.JobMapper;
import vn.phantruongan.backend.job.mappers.JobSkillMapper;
import vn.phantruongan.backend.job.repositories.JobRepository;
import vn.phantruongan.backend.job.repositories.JobSkillRepository;
import vn.phantruongan.backend.job.specification.JobSpecification;
import vn.phantruongan.backend.subscriber.entities.Skill;
import vn.phantruongan.backend.subscriber.repositories.SkillRepository;
import vn.phantruongan.backend.util.error.InvalidException;

@Service
@RequiredArgsConstructor
public class JobService {
        private final JobRepository jobRepository;
        private final JobSkillRepository jobSkillRepository;
        private final CompanyRepository companyRepository;
        private final SkillRepository skillRepository;
        private final JobMapper jobMapper;
        private final JobSkillMapper jobSkillMapper;

        public PaginationResponse<JobResDTO> getAllJobs(GetListJobReqDTO dto, Pageable pageable) {
                Specification<Job> spec = new JobSpecification(dto);
                Page<Job> page = jobRepository.findAll(spec, pageable);
                List<JobResDTO> list = jobMapper.toDtoList(page.getContent());

                PaginationResponse.Meta meta = new PaginationResponse.Meta(
                                page.getNumber() + 1,
                                page.getSize(),
                                page.getTotalElements(),
                                page.getTotalPages());

                return new PaginationResponse<>(list, meta);
        }

        public JobResDTO createJob(CreateJobReqDTO dto) throws InvalidException {

                Job job = jobMapper.toEntity(dto);

                Company company = companyRepository.findById(dto.getCompanyId())
                                .orElseThrow(() -> new InvalidException(
                                                "Company not found with id: " + dto.getCompanyId()));
                job.setCompany(company);

                List<Long> skillIds = dto.getSkillIds().stream()
                                .collect(Collectors.toList());

                List<Skill> skills = skillRepository.findAllById(skillIds);

                Map<Long, Skill> skillMap = skills.stream()
                                .collect(Collectors.toMap(Skill::getId, Function.identity()));

                for (Long skillId : dto.getSkillIds()) {
                        Skill skill = skillMap.get(skillId);
                        if (skill == null) {
                                throw new InvalidException("Skill not found with id: " + skillId);
                        }

                        JobSkill js = new JobSkill();
                        js.setSkill(skill);
                        js.setJob(job);

                        job.getJobSkills().add(js);
                }

                Job savedJob = jobRepository.save(job);
                return jobMapper.toDto(savedJob);
        }

        public JobResDTO findById(long id) throws InvalidException {
                Job job = jobRepository.findById(id)
                                .orElseThrow(() -> new InvalidException("Job not found with id: " + id));

                return jobMapper.toDto(job);
        }

        @Transactional
        public JobResDTO updateJob(UpdateJobReqDTO dto) throws InvalidException {

                Job job = jobRepository.findByIdWithSkills(dto.getId())
                                .orElseThrow(() -> new InvalidException("Job not found"));

                Company company = companyRepository.findById(dto.getCompanyId())
                                .orElseThrow(() -> new InvalidException("Company not found"));

                job.setCompany(company);
                jobMapper.updateEntityFromDto(dto, job);

                Set<Long> newSkillIds = dto.getSkillIds() == null ? Set.of()
                                : dto.getSkillIds().stream()
                                                .collect(Collectors.toSet());

                Set<Long> oldSkillIds = job.getJobSkills().stream()
                                .map(js -> js.getSkill().getId())
                                .collect(Collectors.toSet());

                if (!oldSkillIds.equals(newSkillIds)) {
                        Set<Long> toAdd = new HashSet<>(newSkillIds);
                        Set<Long> toRemove = new HashSet<>(oldSkillIds);
                        toAdd.removeAll(oldSkillIds);
                        toRemove.removeAll(newSkillIds);

                        if (!toRemove.isEmpty()) {
                                job.getJobSkills().removeIf(js -> toRemove.contains(js.getSkill().getId()));

                                jobSkillRepository.deleteByJobIdAndSkillIdIn(job.getId(), new ArrayList<>(toRemove));
                        }

                        if (!toAdd.isEmpty()) {
                                List<Skill> skills = skillRepository.findAllById(toAdd);

                                if (skills.size() != toAdd.size()) {
                                        throw new InvalidException("Some skill IDs are invalid");
                                }

                                List<JobSkill> newJobSkills = skills.stream()
                                                .map(skill -> {
                                                        JobSkill js = new JobSkill();
                                                        js.setJob(job);
                                                        js.setSkill(skill);

                                                        return js;
                                                })
                                                .toList();

                                jobSkillRepository.saveAll(newJobSkills);
                                job.getJobSkills().addAll(newJobSkills);
                        }
                }

                return jobMapper.toDto(job);
        }

        public boolean deleteJobById(long id) throws InvalidException {
                if (id <= 0) {
                        throw new InvalidException("Job ID must be a positive number.");
                }

                Job job = jobRepository.findById(id)
                                .orElseThrow(() -> new InvalidException("Job not found."));

                jobRepository.delete(job);
                return true;
        }

}
