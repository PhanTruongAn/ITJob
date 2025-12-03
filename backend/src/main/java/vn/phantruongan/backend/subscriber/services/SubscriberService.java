package vn.phantruongan.backend.subscriber.services;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
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
            throw new InvalidException("Email already exists");
        }

        Subscriber subscriber = new Subscriber();
        subscriber.setEmail(dto.getEmail().trim().toLowerCase());

        List<Long> skillIds = dto.getSkillIds();
        if (skillIds != null && !skillIds.isEmpty()) {
            List<Skill> skills = skillRepository.findAllById(skillIds);

            if (skills.size() != skillIds.size()) {
                throw new InvalidException("One or more skill IDs are invalid");
            }

            List<SubscriberSkill> links = skills.stream()
                    .map(skill -> {
                        SubscriberSkill link = new SubscriberSkill();
                        link.setSubscriber(subscriber);
                        link.setSkill(skill);
                        return link;
                    })
                    .toList();

            subscriber.getSubscriberSkills().addAll(links);

        }

        Subscriber saved = subscriberRepository.save(subscriber);
        return subscriberMapper.toDto(saved);
    }

    @Transactional
    public SubscriberResDTO updateSubscriber(UpdateSubscriberReqDTO dto) throws InvalidException {

        Subscriber subscriber = subscriberRepository.findByIdWithSkills(dto.getId())
                .orElseThrow(() -> new InvalidException("Subscriber not found"));

        subscriberMapper.updateEntityFromDto(dto, subscriber);

        Set<Long> newSkillIds = dto.getSkillIds() == null ? Set.of() : Set.copyOf(dto.getSkillIds());
        Set<Long> oldSkillIds = subscriber.getSubscriberSkills().stream()
                .map(ss -> ss.getSkill().getId())
                .collect(Collectors.toSet());

        if (!oldSkillIds.equals(newSkillIds)) {
            Set<Long> toAdd = new HashSet<>(newSkillIds);
            Set<Long> toRemove = new HashSet<>(oldSkillIds);
            toAdd.removeAll(oldSkillIds);
            toRemove.removeAll(newSkillIds);

            if (!toRemove.isEmpty()) {
                subscriber.getSubscriberSkills().removeIf(ss -> toRemove.contains(ss.getSkill().getId()));

                subscriberSkillRepository.deleteBySubscriberIdAndSkillIdIn(subscriber.getId(),
                        new ArrayList<>(toRemove));
            }

            if (!toAdd.isEmpty()) {
                List<Skill> skills = skillRepository.findAllById(toAdd);
                List<SubscriberSkill> links = skills.stream()
                        .map(s -> {
                            SubscriberSkill ss = new SubscriberSkill();
                            ss.setSubscriber(subscriber);
                            ss.setSkill(s);
                            return ss;
                        })
                        .toList();

                subscriberSkillRepository.saveAll(links);
                subscriber.getSubscriberSkills().addAll(links);
            }
        }

        return subscriberMapper.toDto(subscriber);
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
