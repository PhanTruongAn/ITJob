package vn.phantruongan.backend.domain.job.entities;

import java.time.Instant;
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
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.domain.common.Auditable;
import vn.phantruongan.backend.domain.company.entities.Company;
import vn.phantruongan.backend.domain.job.enums.LevelEnum;
import vn.phantruongan.backend.domain.resume.entities.Resume;

@Entity
@Table(name = "jobs")
@Getter
@Setter
public class Job extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "Tên việc làm không được để trống!")
    private String name;
    private String location;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;
    private int quantity;
    private Double salary;

    @Enumerated(EnumType.STRING)
    private LevelEnum level;

    private Instant startDate;
    private Instant endDate;
    private boolean isActive;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @JsonIgnore
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JobSkill> jobSkills;

    @JsonIgnore
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Resume> resumes;

}
