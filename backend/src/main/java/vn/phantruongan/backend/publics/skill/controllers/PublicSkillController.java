package vn.phantruongan.backend.publics.skill.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.subscriber.entities.Skill;
import vn.phantruongan.backend.subscriber.repositories.SkillRepository;
import vn.phantruongan.backend.util.annotations.ApiMessage;

@RestController
@RequestMapping(ApiPaths.PUBLIC_SKILLS)
@Tag(name = "Public Skill Controller", description = "Danh sách kỹ năng công khai")
@RequiredArgsConstructor
public class PublicSkillController {

    private final SkillRepository skillRepository;

    @GetMapping
    @ApiMessage("Get all skills")
    public ResponseEntity<List<Skill>> getAllSkills() {
        List<Skill> skills = skillRepository.findAll();
        return ResponseEntity.ok(skills);
    }
}
