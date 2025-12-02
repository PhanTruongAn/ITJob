package vn.phantruongan.backend.bookmark.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.bookmark.entities.SavedJob;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    public Page<SavedJob> findByCandidateId(Long candidateId, Pageable pageable);
}
