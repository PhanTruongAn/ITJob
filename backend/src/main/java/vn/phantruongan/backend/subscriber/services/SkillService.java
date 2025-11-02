package vn.phantruongan.backend.subscriber.services;

import org.springframework.stereotype.Service;

import vn.phantruongan.backend.subscriber.mappers.SkillMapper;
import vn.phantruongan.backend.subscriber.repositories.SkillRepository;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final SkillMapper skillMapper;

    public SkillService(SkillRepository skillRepository, SkillMapper skillMapper) {
        this.skillRepository = skillRepository;
        this.skillMapper = skillMapper;
    }
}
