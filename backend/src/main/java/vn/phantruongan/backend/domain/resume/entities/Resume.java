package vn.phantruongan.backend.domain.resume.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.domain.common.Auditable;
import vn.phantruongan.backend.domain.job.entities.Job;
import vn.phantruongan.backend.domain.resume.enums.ResumeEnum;
import vn.phantruongan.backend.domain.user.entities.User;

@Entity
@Table(name = "resumes")
@Getter
@Setter
public class Resume extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String email;
    private String url;

    @Enumerated(EnumType.STRING)
    private ResumeEnum status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

}
