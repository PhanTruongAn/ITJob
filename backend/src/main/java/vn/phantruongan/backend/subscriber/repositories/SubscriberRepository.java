package vn.phantruongan.backend.subscriber.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.subscriber.entities.Subscriber;

@Repository
public interface SubscriberRepository extends JpaRepository<Subscriber, Long>, JpaSpecificationExecutor<Subscriber> {
    public boolean existsByEmail(String email);

    @EntityGraph(attributePaths = { "subscriberSkills", "subscriberSkills.skill" })
    @Query("SELECT DISTINCT s FROM Subscriber s")
    List<Subscriber> findAllWithSkills();

    @EntityGraph(attributePaths = { "subscriberSkills", "subscriberSkills.skill" })
    @Query("SELECT s FROM Subscriber s WHERE s.id = :id")
    Optional<Subscriber> findByIdWithSkills(@Param("id") Long id);
}
