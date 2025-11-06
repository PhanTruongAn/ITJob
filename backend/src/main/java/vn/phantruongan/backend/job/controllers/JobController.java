package vn.phantruongan.backend.job.controllers;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.job.dtos.req.job.CreateJobReqDTO;
import vn.phantruongan.backend.job.dtos.req.job.GetListJobReqDTO;
import vn.phantruongan.backend.job.dtos.req.job.UpdateJobReqDTO;
import vn.phantruongan.backend.job.dtos.res.JobResDTO;
import vn.phantruongan.backend.job.services.JobService;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.annotations.RequirePermission;
import vn.phantruongan.backend.util.error.InvalidException;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Job Controller", description = "Quản lý việc làm")
public class JobController {
    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @RequirePermission(resource = ResourceEnum.JOB, action = ActionEnum.READ)
    @GetMapping("/jobs")
    @ApiMessage("Get list job with filter")
    public ResponseEntity<PaginationResponse<JobResDTO>> getAllJobs(
            @ParameterObject GetListJobReqDTO dto,
            @ParameterObject Pageable pageable) {

        PaginationResponse<JobResDTO> result = jobService.getAllJobs(dto, pageable);
        return ResponseEntity.ok(result);
    }

    @RequirePermission(resource = ResourceEnum.JOB, action = ActionEnum.CREATE)
    @PostMapping("/jobs")
    @ApiMessage("Create new job")
    public ResponseEntity<JobResDTO> createJob(@Valid @RequestBody CreateJobReqDTO dto) throws InvalidException {

        JobResDTO newJob = jobService.createJob(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newJob);

    }

    @RequirePermission(resource = ResourceEnum.JOB, action = ActionEnum.UPDATE)
    @PutMapping("/jobs")
    @ApiMessage("Job updated")
    public ResponseEntity<JobResDTO> updateJob(@Valid @RequestBody UpdateJobReqDTO dto)
            throws InvalidException {

        JobResDTO jobUpdated = jobService.updateJob(dto);
        return ResponseEntity.ok(jobUpdated);
    }

    @RequirePermission(resource = ResourceEnum.JOB, action = ActionEnum.READ)
    @GetMapping("/jobs/{id}")
    @ApiMessage("Get job by id")
    public ResponseEntity<JobResDTO> findJobById(@PathVariable("id") long id) throws InvalidException {
        JobResDTO job = jobService.findById(id);
        return ResponseEntity.ok(job);
    }

    @RequirePermission(resource = ResourceEnum.JOB, action = ActionEnum.DELETE)
    @DeleteMapping("/jobs/{id}")
    @ApiMessage("Job deleted")
    public ResponseEntity<Boolean> deleteJob(@PathVariable("id") long id) throws InvalidException {
        boolean isDelete = jobService.deleteJobById(id);

        return ResponseEntity.ok(isDelete);

    }
}
