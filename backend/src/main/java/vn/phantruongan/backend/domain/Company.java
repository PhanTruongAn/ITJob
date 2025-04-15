package vn.phantruongan.backend.domain;

import java.time.DayOfWeek;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import vn.phantruongan.backend.util.convert.DayOfWeekListConverter;
import vn.phantruongan.backend.util.enums.CompanyType;

@Entity
@Table(name = "companies", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "name", "country_id" })
})
@Getter
@Setter
@ToString
public class Company extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "Company can not null!")
    private String name;

    @Enumerated(EnumType.STRING)
    private CompanyType companyType;

    private String companySize;

    private String industry;
    private boolean overtime;

    @Convert(converter = DayOfWeekListConverter.class)
    private List<DayOfWeek> workingDays;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;

    private String address;
    private String logo;

    @JsonIgnore
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<User> users;

    @JsonIgnore
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Job> jobs;

}
