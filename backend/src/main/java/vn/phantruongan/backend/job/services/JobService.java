package vn.phantruongan.backend.job.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

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
public class JobService {
    private final JobRepository jobRepository;
    private final JobSkillRepository jobSkillRepository;
    private final CompanyRepository companyRepository;
    private final SkillRepository skillRepository;
    private final JobMapper jobMapper;
    private final JobSkillMapper jobSkillMapper;

    public JobService(
            JobRepository jobRepository,
            JobSkillRepository jobSkillRepository,
            CompanyRepository companyRepository,
            SkillRepository skillRepository,
            JobMapper jobMapper,
            JobSkillMapper jobSkillMapper) {
        this.jobRepository = jobRepository;
        this.jobSkillRepository = jobSkillRepository;
        this.companyRepository = companyRepository;
        this.skillRepository = skillRepository;
        this.jobMapper = jobMapper;
        this.jobSkillMapper = jobSkillMapper;
    }

    public PaginationResponse<JobResDTO> getAllJobs(GetListJobReqDTO dto, Pageable pageable) {
        Specification<Job> spec = new JobSpecification(dto);
        Page<Job> page = jobRepository.findAll(spec, pageable);
        List<JobResDTO> list = page.getContent().stream()
                .map(jobMapper::toDto)
                .collect(Collectors.toList());

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
                .orElseThrow(() -> new InvalidException("Company not found with id: " + dto.getCompanyId()));
        job.setCompany(company);

        List<JobSkill> jobSkills = dto.getSkills().stream()
                .map(skillDto -> {
                    Skill skill = skillRepository.findById(skillDto.getSkillId())
                            .orElseThrow(
                                    () -> new InvalidException("Skill not found with id: " + skillDto.getSkillId()));

                    JobSkill js = new JobSkill();
                    js.setSkill(skill);
                    js.setJob(job);
                    js.setRequired(skillDto.isRequired());
                    js.setPriority(skillDto.getPriority());
                    return js;
                })
                .collect(Collectors.toList());

        job.setJobSkills(jobSkills);
        Job savedJob = jobRepository.save(job);
        return jobMapper.toDto(savedJob);
    }

    public JobResDTO findById(long id) throws InvalidException {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Job not found with id: " + id));

        return jobMapper.toDto(job);
    }

    public JobResDTO updateJob(UpdateJobReqDTO dto) throws InvalidException {
        Job existingJob = jobRepository.findById(dto.getId())
                .orElseThrow(() -> new InvalidException("Job not found"));

        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new InvalidException("Company not found"));

        existingJob.setCompany(company);
        jobMapper.updateEntityFromDto(dto, existingJob);

        Job jobUpdated = jobRepository.save(existingJob);
        return jobMapper.toDto(jobUpdated);

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
