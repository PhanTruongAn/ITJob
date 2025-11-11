package vn.phantruongan.backend.subscriber.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.subscriber.dtos.req.skill.CreateSkillReqDTO;
import vn.phantruongan.backend.subscriber.dtos.req.skill.GetListSkillReqDTO;
import vn.phantruongan.backend.subscriber.dtos.req.skill.UpdateSkillReqDTO;
import vn.phantruongan.backend.subscriber.dtos.res.SkillResDTO;
import vn.phantruongan.backend.subscriber.entities.Skill;
import vn.phantruongan.backend.subscriber.mappers.SkillMapper;
import vn.phantruongan.backend.subscriber.repositories.SkillRepository;
import vn.phantruongan.backend.subscriber.specification.SkillSpecification;
import vn.phantruongan.backend.util.error.InvalidException;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;
    private final SkillMapper skillMapper;

    public PaginationResponse<SkillResDTO> getAllSkills(GetListSkillReqDTO dto, Pageable pageable) {
        Specification<Skill> spec = new SkillSpecification(dto);
        Page<Skill> page = skillRepository.findAll(spec, pageable);
        List<SkillResDTO> list = page.getContent().stream()
                .map(skillMapper::toDto)
                .collect(Collectors.toList());

        PaginationResponse.Meta meta = new PaginationResponse.Meta(
                page.getNumber() + 1,
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());

        return new PaginationResponse<>(list, meta);
    }

    public SkillResDTO createSkill(CreateSkillReqDTO dto) throws InvalidException {
        Skill skill = skillMapper.toEntity(dto);
        if (skillRepository.existsByName(dto.getName())) {
            throw new InvalidException("Skill already existed");
        }
        Skill skillSaved = skillRepository.save(skill);
        return skillMapper.toDto(skillSaved);
    }

    public SkillResDTO findById(long id) throws InvalidException {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Skill not found with id: " + id));

        return skillMapper.toDto(skill);
    }

    public SkillResDTO updateSkill(UpdateSkillReqDTO dto) throws InvalidException {
        Skill existingSkill = skillRepository.findById(dto.getId())
                .orElseThrow(() -> new InvalidException("Skill not found"));

        skillMapper.updateEntityFromDto(dto, existingSkill);

        Skill skillUpdated = skillRepository.save(existingSkill);
        return skillMapper.toDto(skillUpdated);

    }

    public boolean deleteSkillById(long id) throws InvalidException {
        if (id <= 0) {
            throw new InvalidException("Skill ID must be a positive number.");
        }

        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Skill not found."));

        skillRepository.delete(skill);
        return true;
    }
}
