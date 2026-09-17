package vn.phantruongan.backend.file.entities;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.common.BaseSoftDelete;
import vn.phantruongan.backend.file.enums.FileCategoryEnum;

@Entity
@Table(name = "files")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE files SET deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted = false")
public class File extends BaseSoftDelete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileKey;

    @Column(columnDefinition = "TEXT")
    private String fileUrl;

    private String fileType;

    private String fileExtension;

    private long fileSize;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FileCategoryEnum category;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean isDefault = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
