package com.example.seva_connect_backend.repository;

import com.example.seva_connect_backend.entity.VolunteerRequestEntity;
import com.example.seva_connect_backend.entity.VolunteerRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerRequestRepository extends JpaRepository<VolunteerRequestEntity, Long> {

    List<VolunteerRequestEntity> findByVolunteerId(Long volunteerId);

    List<VolunteerRequestEntity> findByEventId(Long eventId);

    List<VolunteerRequestEntity> findByStatus(VolunteerRequestStatus status);

    boolean existsByVolunteerIdAndEventId(Long volunteerId, Long eventId);

    Optional<VolunteerRequestEntity> findByVolunteerIdAndEventId(Long volunteerId, Long eventId);

    long countByStatus(VolunteerRequestStatus status);

    long countByVolunteerIdAndStatus(Long volunteerId, VolunteerRequestStatus status);

    long countByVolunteerIdAndStatusAndEvent_EventDateBefore(Long volunteerId, VolunteerRequestStatus status, java.time.LocalDate date);

    @Modifying
    @Transactional
    void deleteByVolunteerId(Long volunteerId);

    @Modifying
    @Transactional
    void deleteByEventId(Long eventId);
}