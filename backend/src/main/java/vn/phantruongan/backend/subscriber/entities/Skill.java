package vn.phantruongan.backend.subscriber.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import vn.phantruongan.backend.common.Auditable;
import vn.phantruongan.backend.job.entities.JobSkill;
import vn.phantruongan.backend.subscriber.enums.SkillCategory;

@Entity
@Table(name = "skills", indexes = {
        @Index(name = "idx_skill_name", columnList = "name", unique = true)
})
@Getter
@Setter
@ToString
public class Skill extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    private SkillCategory category;

    @JsonIgnore
    @OneToMany(mappedBy = "skill", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<JobSkill> jobSkills;

    @JsonIgnore
    @OneToMany(mappedBy = "skill", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<SubscriberSkill> subscriberSkills;
}
