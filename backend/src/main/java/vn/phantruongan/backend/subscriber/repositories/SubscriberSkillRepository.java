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
    @Query("DELETE FROM SubscriberSkill rp WHERE rp.subscriber.id = :subscriberId AND rp.skill.id IN :skillIds")
    void deleteBySubscriberIdAndSkillIds(@Param("subscriberId") Long subscriberId,
            @Param("skillIds") List<Long> skillIds);
}
