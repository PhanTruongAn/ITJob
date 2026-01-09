package vn.phantruongan.backend.subscriber.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.subscriber.entities.Skill;
import vn.phantruongan.backend.subscriber.projection.SkillOptionProjection;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long>, JpaSpecificationExecutor<Skill> {
    public boolean existsByName(String name);

    // Get skill options for dropdowns select
    @Query("""
                SELECT s.id AS id,
                       s.name AS name
                FROM Skill s
                ORDER BY s.name
            """)
    List<SkillOptionProjection> findSkillOptions();
}
