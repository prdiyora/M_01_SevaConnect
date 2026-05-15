package com.example.seva_connect_backend.repository;

import com.example.seva_connect_backend.entity.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Long> {

    List<EventEntity> findByCategory(String category);

    @Query("SELECT e FROM EventEntity e WHERE e.visible = true OR e.visible IS NULL")
    List<EventEntity> findByVisibleTrue();

    @Query("SELECT e FROM EventEntity e WHERE (e.visible = true OR e.visible IS NULL) AND e.category = :category")
    List<EventEntity> findByVisibleTrueAndCategory(@Param("category") String category);

    @Query("SELECT e FROM EventEntity e WHERE (e.visible = true OR e.visible IS NULL) AND LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<EventEntity> findByVisibleTrueAndTitleContainingIgnoreCase(@Param("keyword") String keyword);

    List<EventEntity> findByTitleContainingIgnoreCase(String keyword);

    @Query("SELECT e.category AS category, COUNT(e) AS count FROM EventEntity e GROUP BY e.category")
    List<Object[]> countEventsByCategory();

    long countByEventDateAfter(java.time.LocalDate date);

    long countByEventDateGreaterThanEqual(java.time.LocalDate date);
}
