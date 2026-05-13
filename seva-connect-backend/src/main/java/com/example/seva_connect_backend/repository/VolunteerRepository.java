package com.example.seva_connect_backend.repository;

import com.example.seva_connect_backend.entity.Role;
import com.example.seva_connect_backend.entity.VolunteerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerRepository extends JpaRepository<VolunteerEntity, Long> {

    Optional<VolunteerEntity> findByEmail(String email);

    long countByRole(Role role);

    @Query("SELECT v FROM VolunteerEntity v " +
            "WHERE LOWER(v.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(v.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<VolunteerEntity> searchByKeyword(@Param("keyword") String keyword);
}
