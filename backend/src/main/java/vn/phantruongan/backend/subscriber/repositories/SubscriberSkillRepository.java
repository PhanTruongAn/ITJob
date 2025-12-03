package vn.phantruongan.backend.subscriber.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.subscriber.entities.SubscriberSkill;

@Repository
public interface SubscriberSkillRepository extends JpaRepository<SubscriberSkill, Long> {
    @Modifying
    @Query("DELETE FROM SubscriberSkill ss " +
            "WHERE ss.subscriber.id = :subscriberId " +
            "AND ss.skill.id IN :skillIds")
    void deleteBySubscriberIdAndSkillIdIn(
            @Param("subscriberId") Long subscriberId,
            @Param("skillIds") List<Long> skillIds);
}
