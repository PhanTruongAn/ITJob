package vn.phantruongan.backend.job.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.job.entities.Job;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
    @EntityGraph(attributePaths = { "jobSkills", "jobSkills.skill" })
    @Query("SELECT DISTINCT j FROM Job j")
    List<Job> findAllWithSkills();

    @EntityGraph(attributePaths = { "jobSkills", "jobSkills.skill" })
    @Query("SELECT j FROM Job j WHERE j.id = :id")
    Optional<Job> findByIdWithSkills(@Param("id") Long id);
}
