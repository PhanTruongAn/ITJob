package vn.phantruongan.backend.cvbuilder.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.cvbuilder.entities.CandidateCv;

@Repository
public interface CandidateCvRepository extends JpaRepository<CandidateCv, Long>, JpaSpecificationExecutor<CandidateCv> {

    List<CandidateCv> findByUserOrderByUpdatedAtDesc(User user);

    Optional<CandidateCv> findByIdAndUser(Long id, User user);

    Optional<CandidateCv> findByUserAndIsDefaultTrue(User user);

    long countByUser(User user);
}
