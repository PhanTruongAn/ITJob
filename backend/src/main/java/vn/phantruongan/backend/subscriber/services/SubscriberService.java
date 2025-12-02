package vn.phantruongan.backend.subscriber.services;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.subscriber.dtos.req.subscriber.CreateSubscriberReqDTO;
import vn.phantruongan.backend.subscriber.dtos.req.subscriber.GetListSubscriberReqDTO;
import vn.phantruongan.backend.subscriber.dtos.req.subscriber.UpdateSubscriberReqDTO;
import vn.phantruongan.backend.subscriber.dtos.res.SubscriberResDTO;
import vn.phantruongan.backend.subscriber.entities.Skill;
import vn.phantruongan.backend.subscriber.entities.Subscriber;
import vn.phantruongan.backend.subscriber.entities.SubscriberSkill;
import vn.phantruongan.backend.subscriber.mappers.SubscriberMapper;
import vn.phantruongan.backend.subscriber.repositories.SkillRepository;
import vn.phantruongan.backend.subscriber.repositories.SubscriberRepository;
import vn.phantruongan.backend.subscriber.repositories.SubscriberSkillRepository;
import vn.phantruongan.backend.subscriber.specification.SubscriberSpecification;
import vn.phantruongan.backend.util.error.InvalidException;

@Service
@RequiredArgsConstructor
public class SubscriberService {
    private final SubscriberRepository subscriberRepository;
    private final SubscriberSkillRepository subscriberSkillRepository;
    private final SkillRepository skillRepository;
    private final SubscriberMapper subscriberMapper;

    public PaginationResponse<SubscriberResDTO> getAllSubscribers(GetListSubscriberReqDTO dto, Pageable pageable) {
        Specification<Subscriber> spec = new SubscriberSpecification(dto);
        Page<Subscriber> page = subscriberRepository.findAll(spec, pageable);
        List<SubscriberResDTO> list = page.getContent().stream()
                .map(subscriberMapper::toDto)
                .toList();

        PaginationResponse.Meta meta = new PaginationResponse.Meta(
                page.getNumber() + 1,
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());

        return new PaginationResponse<>(list, meta);
    }

    @Transactional
    public SubscriberResDTO createSubscriber(CreateSubscriberReqDTO dto) throws InvalidException {

        if (subscriberRepository.existsByEmail(dto.getEmail())) {
            throw new InvalidException("Subscriber already exists");
        }

        Subscriber subscriber = new Subscriber();
        subscriber.setEmail(dto.getEmail());
        Subscriber subscriberSaved = subscriberRepository.save(subscriber);

        List<Long> skillIds = dto.getSkillIds();
        if (skillIds != null && !skillIds.isEmpty()) {
            List<Skill> skills = skillRepository.findAllById(skillIds);
            List<SubscriberSkill> subscriberSkills = skills.stream()
                    .map(skill -> {
                        SubscriberSkill sp = new SubscriberSkill();
                        sp.setSubscriber(subscriberSaved);
                        sp.setSkill(skill);
                        subscriber.getSubscriberSkills().add(sp);
                        return sp;
                    })
                    .collect(Collectors.toList());
            subscriberSkillRepository.saveAll(subscriberSkills);
        }
        return subscriberMapper.toDto(subscriberSaved);
    }

    @Transactional
    public Map<String, Integer> updateSubscriber(UpdateSubscriberReqDTO dto) throws InvalidException {

        List<Long> newSkillIds = dto.getSkillIds();
        Subscriber existingSubscriber = subscriberRepository.findById(dto.getId())
                .orElseThrow(() -> new InvalidException("Subscriber not found"));

        // Get list of skill current
        List<Long> oldSkillIds = existingSubscriber.getSubscriberSkills().stream()
                .map(sp -> sp.getSkill().getId())
                .collect(Collectors.toList());

        Set<Long> oldSet = new HashSet<>(oldSkillIds);
        Set<Long> newSet = new HashSet<>(newSkillIds);
        if (oldSet.equals(newSet)) {
            return Map.of("addedCount", 0, "removedCount", 0);
        }

        // If have change, we determine skills need to add and remove
        Set<Long> toAdd = new HashSet<>(newSkillIds);
        toAdd.removeAll(oldSkillIds);

        Set<Long> toRemove = new HashSet<>(oldSkillIds);
        toRemove.removeAll(newSkillIds);

        // Remove the skills that were deselected
        if (!toRemove.isEmpty()) {
            subscriberSkillRepository.deleteBySubscriberIdAndSkillIds(dto.getId(), new ArrayList<>(toRemove));
        }

        // Add the newly selected skills
        int addedCount = 0;
        if (!toAdd.isEmpty()) {
            List<Skill> skills = skillRepository.findAllById(toAdd);
            List<SubscriberSkill> newSps = skills.stream()
                    .map(skill -> {
                        SubscriberSkill sp = new SubscriberSkill();
                        sp.setSubscriber(existingSubscriber);
                        sp.setSkill(skill);
                        return sp;
                    })
                    .collect(Collectors.toList());
            subscriberSkillRepository.saveAll(newSps);
            addedCount = newSps.size();
        }
        return Map.of("addedCount", addedCount, "removedCount", toRemove.size());
    }

    public SubscriberResDTO findById(long id) throws InvalidException {
        Subscriber subscriber = subscriberRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Subscriber not found with id: " + id));

        return subscriberMapper.toDto(subscriber);
    }

    public boolean deleteSubscriberById(long id) throws InvalidException {
        if (id <= 0) {
            throw new InvalidException("Subscriber ID must be a positive number.");
        }

        Subscriber subscriber = subscriberRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Subscriber not found."));

        subscriberRepository.delete(subscriber);
        return true;
    }

}
