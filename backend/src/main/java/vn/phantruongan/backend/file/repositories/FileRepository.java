package vn.phantruongan.backend.file.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.file.entities.File;
import vn.phantruongan.backend.file.enums.FileCategoryEnum;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {

    List<File> findByUserAndCategoryOrderByCreatedAtDesc(User user, FileCategoryEnum category);

    Optional<File> findByUserAndCategoryAndIsDefaultTrue(User user, FileCategoryEnum category);

    Optional<File> findByIdAndUser(long id, User user);
}
