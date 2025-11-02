package vn.phantruongan.backend.job.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.job.entities.JobSkill;

@Repository
public interface JobSkillRepository extends JpaRepository<JobSkill, Long> {
}
