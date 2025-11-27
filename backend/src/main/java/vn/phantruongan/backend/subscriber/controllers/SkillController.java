package vn.phantruongan.backend.subscriber.controllers;

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
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.subscriber.dtos.req.skill.CreateSkillReqDTO;
import vn.phantruongan.backend.subscriber.dtos.req.skill.GetListSkillReqDTO;
import vn.phantruongan.backend.subscriber.dtos.req.skill.UpdateSkillReqDTO;
import vn.phantruongan.backend.subscriber.dtos.res.SkillResDTO;
import vn.phantruongan.backend.subscriber.services.SkillService;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.annotations.RequirePermission;
import vn.phantruongan.backend.util.error.InvalidException;

@RestController
@RequestMapping(ApiPaths.SKILLS)
@Tag(name = "Skill Controller", description = "Quản lý kỹ năng")
@RequiredArgsConstructor
public class SkillController {
    private final SkillService skillService;

    @RequirePermission(resource = ResourceEnum.SKILL, action = ActionEnum.READ)
    @GetMapping()
    @ApiMessage("Get list skill with filter")
    public ResponseEntity<PaginationResponse<SkillResDTO>> getAllSkills(
            @ParameterObject GetListSkillReqDTO dto,
            @ParameterObject Pageable pageable) {

        PaginationResponse<SkillResDTO> result = skillService.getAllSkills(dto, pageable);
        return ResponseEntity.ok(result);
    }

    @RequirePermission(resource = ResourceEnum.SKILL, action = ActionEnum.CREATE)
    @PostMapping()
    @ApiMessage("Create new skill")
    public ResponseEntity<SkillResDTO> createSkill(@Valid @RequestBody CreateSkillReqDTO dto) throws InvalidException {

        SkillResDTO newSkill = skillService.createSkill(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newSkill);

    }

    @RequirePermission(resource = ResourceEnum.SKILL, action = ActionEnum.UPDATE)
    @PutMapping()
    @ApiMessage("Skill updated")
    public ResponseEntity<SkillResDTO> updateSkill(@Valid @RequestBody UpdateSkillReqDTO dto)
            throws InvalidException {

        SkillResDTO skillUpdated = skillService.updateSkill(dto);
        return ResponseEntity.ok(skillUpdated);
    }

    @RequirePermission(resource = ResourceEnum.SKILL, action = ActionEnum.READ)
    @GetMapping("/{id}")
    @ApiMessage("Get skill by id")
    public ResponseEntity<SkillResDTO> findSkillById(@PathVariable("id") long id) throws InvalidException {
        SkillResDTO skill = skillService.findById(id);
        return ResponseEntity.ok(skill);
    }

    @RequirePermission(resource = ResourceEnum.SKILL, action = ActionEnum.DELETE)
    @DeleteMapping("/{id}")
    @ApiMessage("Skill deleted")
    public ResponseEntity<Boolean> deleteSkill(@PathVariable("id") long id) throws InvalidException {
        boolean isDelete = skillService.deleteSkillById(id);

        return ResponseEntity.ok(isDelete);

    }
}
