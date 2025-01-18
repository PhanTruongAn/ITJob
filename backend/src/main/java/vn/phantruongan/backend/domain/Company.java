package vn.phantruongan.backend.domain;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "companies")
@Setter
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;

    private String address;
    private String logo;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;

    public Company() {
    }

    public Company(String name, String description, String address, String logo) {
        this.name = name;
        this.description = description;
        this.address = address;
        this.logo = logo;
    }

    public Company(long id, String name, String description, String address,
            String logo, Instant createdAt,
            Instant updatedAt, String createdBy, String updatedBy) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.address = address;
        this.logo = logo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
    }

    @Override
    public String toString() {
        return "Company [id=" + id + ", name=" + name + ", description=" +
                description + ", address=" + address
                + ", logo=" + logo + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt
                + ", createdBy="
                + createdBy + ", updatedBy=" + updatedBy + "]";
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getAddress() {
        return address;
    }

    public String getLogo() {
        return logo;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

}
