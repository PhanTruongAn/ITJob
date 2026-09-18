package vn.phantruongan.backend.resume.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.resume.entities.Resume;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long>, JpaSpecificationExecutor<Resume> {

    boolean existsByUserIdAndJobId(long userId, long jobId);

    List<Resume> findByUserIdOrderByCreatedAtDesc(long userId);

    Optional<Resume> findByUserIdAndJobId(long userId, long jobId);
}
