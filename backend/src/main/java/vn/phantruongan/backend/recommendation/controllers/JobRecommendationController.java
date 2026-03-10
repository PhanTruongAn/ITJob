package vn.phantruongan.backend.recommendation.controllers;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.cronjob.entities.CronJob;
import vn.phantruongan.backend.cronjob.services.CronJobService;
import vn.phantruongan.backend.recommendation.dtos.res.JobRecommendationResDTO;
import vn.phantruongan.backend.recommendation.enums.RecommendationStatus;
import vn.phantruongan.backend.recommendation.services.JobRecommendationService;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.annotations.RequirePermission;
import vn.phantruongan.backend.util.error.InvalidException;

@RestController
@RequestMapping(ApiPaths.RECOMMENDATIONS)
@Tag(name = "Recommendation Controller", description = "Quản lý việc làm gợi ý")
@RequiredArgsConstructor
public class JobRecommendationController {

    private final JobRecommendationService jobRecommendationService;
    private final CronJobService cronJobService;

    @RequirePermission(resource = ResourceEnum.RECOMMENDATION, action = ActionEnum.READ)
    @GetMapping("/config")
    @ApiMessage("Get job recommendation configuration")
    public ResponseEntity<CronJob> getConfig() {
        return ResponseEntity.ok(cronJobService.getJobRecommendationConfig());
    }

    @RequirePermission(resource = ResourceEnum.RECOMMENDATION, action = ActionEnum.UPDATE)
    @PatchMapping("/config")
    @ApiMessage("Update job recommendation configuration")
    public ResponseEntity<CronJob> updateConfig(
            @org.springframework.web.bind.annotation.RequestBody CronJob config) {
        return ResponseEntity.ok(cronJobService.updateJobRecommendationConfig(config));
    }

    @RequirePermission(resource = ResourceEnum.RECOMMENDATION, action = ActionEnum.READ)
    @GetMapping("/jobs")
    @ApiMessage("Get all job recommendations")
    public ResponseEntity<PaginationResponse<JobRecommendationResDTO>> getAllJobRecommendations(
            @RequestParam Long subscriberId,
            @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(jobRecommendationService.getAllJobRecommendations(subscriberId, pageable));
    }

    @RequirePermission(resource = ResourceEnum.RECOMMENDATION, action = ActionEnum.UPDATE)
    @PatchMapping("/jobs/{id}/status")
    @ApiMessage("Update job recommendation status")
    public ResponseEntity<JobRecommendationResDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam RecommendationStatus status) throws InvalidException {
        return ResponseEntity.ok(jobRecommendationService.updateStatus(id, status));
    }

    @RequirePermission(resource = ResourceEnum.RECOMMENDATION, action = ActionEnum.DELETE)
    @DeleteMapping("/jobs/{id}")
    @ApiMessage("Delete job recommendation")
    public ResponseEntity<Void> deleteJobRecommendation(@PathVariable Long id) throws InvalidException {
        jobRecommendationService.deleteJobRecommendation(id);
        return ResponseEntity.noContent().build();
    }

    @RequirePermission(resource = ResourceEnum.RECOMMENDATION, action = ActionEnum.UPDATE)
    @PostMapping("/jobs/generate")
    @ApiMessage("Trigger job recommendation generation")
    public ResponseEntity<Void> generateRecommendations() {
        jobRecommendationService.generateJobRecommendations();
        return ResponseEntity.accepted().build();
    }
}
