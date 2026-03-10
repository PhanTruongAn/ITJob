package vn.phantruongan.backend.cronjob.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.phantruongan.backend.cronjob.entities.CronJob;

import java.util.Optional;

@Repository
public interface CronJobRepository extends JpaRepository<CronJob, Long> {
    Optional<CronJob> findByName(String name);
}
