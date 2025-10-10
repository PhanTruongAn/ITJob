package vn.phantruongan.backend.domain.skill;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.common.Auditable;
import vn.phantruongan.backend.domain.job.entities.JobSkill;
import vn.phantruongan.backend.domain.subscriber.SubscriberSkill;

@Entity
@Table(name = "skills")
@Getter
@Setter
public class Skill extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "Tên kĩ năng không được để trống!")
    private String name;

    @JsonIgnore
    @OneToMany(mappedBy = "skill", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JobSkill> jobSkills;

    @JsonIgnore
    @OneToMany(mappedBy = "skill", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubscriberSkill> subscriberSkills;
}
