package vn.phantruongan.backend.bookmark.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.bookmark.entities.SavedCompany;

@Repository
public interface SavedCompanyRepository extends JpaRepository<SavedCompany, Long> {
    public Page<SavedCompany> findByCandidateId(Long candidateId, Pageable pageable);
}
