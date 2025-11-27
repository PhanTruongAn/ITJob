package vn.phantruongan.backend.follow.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.phantruongan.backend.follow.entities.FollowCompany;

@Repository
public interface FollowCompanyRepository extends JpaRepository<FollowCompany, Long> {

}
