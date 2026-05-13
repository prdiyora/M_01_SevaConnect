package com.example.seva_connect_backend.repository;

import com.example.seva_connect_backend.entity.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Long> {

    List<EventEntity> findByCategory(String category);

    List<EventEntity> findByTitleContainingIgnoreCase(String keyword);

    @Query("SELECT e.category AS category, COUNT(e) AS count FROM EventEntity e GROUP BY e.category")
    List<Object[]> countEventsByCategory();

    long countByEventDateAfter(java.time.LocalDate date);

    long countByEventDateGreaterThanEqual(java.time.LocalDate date);
}
