package vn.phantruongan.backend.notification.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.notification.entities.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findByUser_IdAndCategoryOrderByCreatedAtDescIdDesc(
            Long userId, String category, Pageable pageable);

    Page<Notification> findByUser_IdAndCategoryIsNullOrderByCreatedAtDescIdDesc(Long userId, Pageable pageable);

    long countByUser_IdAndCategoryAndReadFalse(Long userId, String category);

    long countByUser_IdAndCategoryIsNullAndReadFalse(Long userId);

    boolean existsByDeduplicationKey(String deduplicationKey);

    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.id = :notificationId "
            + "AND n.user.id = :userId AND n.category IS NULL")
    int markCandidateReadByIdAndUserId(@Param("notificationId") Long notificationId,
            @Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.id = :notificationId "
            + "AND n.user.id = :userId AND n.category = :category")
    int markReadByIdAndUserIdAndCategory(@Param("notificationId") Long notificationId,
            @Param("userId") Long userId, @Param("category") String category);

    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.user.id = :userId "
            + "AND n.category IS NULL AND n.read = false")
    int markAllCandidateReadByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.user.id = :userId "
            + "AND n.category = :category AND n.read = false")
    int markAllReadByUserIdAndCategory(@Param("userId") Long userId, @Param("category") String category);
}
