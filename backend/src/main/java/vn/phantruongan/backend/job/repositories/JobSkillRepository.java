package vn.phantruongan.backend.job.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.job.entities.JobSkill;

@Repository
public interface JobSkillRepository extends JpaRepository<JobSkill, Long> {

    @Modifying
    @Query("DELETE FROM JobSkill js WHERE js.job.id = :jobId AND js.skill.id IN :skillIds")
    void deleteByJobIdAndSkillIdIn(@Param("jobId") Long jobId, @Param("skillIds") List<Long> skillIds);

}
