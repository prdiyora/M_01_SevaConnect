package com.example.seva_connect_backend.repository;

import com.example.seva_connect_backend.entity.VolunteerEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface VolunteerEventRepository extends JpaRepository<VolunteerEventEntity, Long> {

    List<VolunteerEventEntity> findByVolunteerId(Long volunteerId);

    List<VolunteerEventEntity> findByEventId(Long eventId);

    boolean existsByVolunteerIdAndEventId(Long volunteerId, Long eventId);

    boolean existsByVolunteer_Id(Long volunteerId);

    @Modifying
    @Transactional
    void deleteByVolunteerId(Long volunteerId);

    @Modifying
    @Transactional
    void deleteByEventId(Long eventId);

    @org.springframework.data.jpa.repository.Query(value = "SELECT TO_CHAR(joined_at, 'Month') as month, COUNT(*) as count FROM volunteer_events GROUP BY month", nativeQuery = true)
    List<Object[]> countRegistrationsByMonth();

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(DISTINCT ve.volunteer.id) FROM VolunteerEventEntity ve")
    long countUniqueVolunteers();

}
