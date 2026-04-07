package vn.phantruongan.backend.guest.controllers;

import java.util.List;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.guest.services.PublicJobService;
import vn.phantruongan.backend.job.dtos.req.job.GetListJobReqDTO;
import vn.phantruongan.backend.job.dtos.res.JobResDTO;
import vn.phantruongan.backend.job.services.JobService;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.error.InvalidException;

@RestController
@RequestMapping(ApiPaths.PUBLIC_JOBS)
@Tag(name = "Public Job Controller", description = "Quản lý việc làm công khai")
@RequiredArgsConstructor
public class PublicJobController {
    private final JobService jobService;
    private final PublicJobService publicJobService;

    @GetMapping()
    @ApiMessage("Get list job with filter")
    public ResponseEntity<PaginationResponse<JobResDTO>> getAllJobs(
            @ParameterObject GetListJobReqDTO dto,
            @ParameterObject Pageable pageable) {

        PaginationResponse<JobResDTO> result = jobService.getAllJobs(dto, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @ApiMessage("Get job by id")
    public ResponseEntity<JobResDTO> findJobById(@PathVariable("id") long id) throws InvalidException {
        JobResDTO job = jobService.findById(id);
        return ResponseEntity.ok(job);
    }

    @GetMapping("/latest")
    @ApiMessage("Get latest public jobs")
    public ResponseEntity<List<JobResDTO>> getLatestJobs(
            @RequestParam(defaultValue = "6") int limit) {

        return ResponseEntity.ok(publicJobService.getLatestJobs(limit));
    }
}
