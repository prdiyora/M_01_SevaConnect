package com.example.seva_connect_backend.service;

import com.example.seva_connect_backend.dto.VolunteerDto;
import com.example.seva_connect_backend.entity.VolunteerEntity;
import com.example.seva_connect_backend.entity.VolunteerRequestStatus;
import com.example.seva_connect_backend.exception.ResourceNotFoundException;
import com.example.seva_connect_backend.repository.EventRepository;
import com.example.seva_connect_backend.repository.VolunteerEventRepository;
import com.example.seva_connect_backend.repository.VolunteerRepository;
import com.example.seva_connect_backend.repository.VolunteerRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VolunteerService {

    private final VolunteerRepository volunteerRepository;

    @Autowired
    private VolunteerEventRepository volunteerEventRepository;

    @Autowired
    private VolunteerRequestRepository volunteerRequestRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private com.example.seva_connect_backend.repository.NotificationRepository notificationRepository;

    public VolunteerService(VolunteerRepository volunteerRepository) {
        this.volunteerRepository = volunteerRepository;
    }

    private VolunteerDto mapToDTO(VolunteerEntity volunteer) {
        VolunteerDto dto = new VolunteerDto();
        dto.setId(volunteer.getId());
        dto.setName(volunteer.getName());
        dto.setEmail(volunteer.getEmail());
        dto.setPhone(volunteer.getPhone());
        dto.setCity(volunteer.getCity());
        dto.setRole(volunteer.getRole().name());
        return dto;
    }

    public Map<String, Object> getVolunteerStats(String email) {
        VolunteerEntity volunteer = volunteerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found with email: " + email));
        Long volunteerId = volunteer.getId();

        long availableEvents = eventRepository.countByEventDateGreaterThanEqual(LocalDate.now());
        long joinedEvents = volunteerRequestRepository.countByVolunteerIdAndStatus(volunteerId, VolunteerRequestStatus.APPROVED);
        long pendingEvents = volunteerRequestRepository.countByVolunteerIdAndStatus(volunteerId, VolunteerRequestStatus.PENDING);

        // Impact stats based on actual approved events
        long peopleHelped = joinedEvents * 10; 
        long hoursVolunteered = joinedEvents * 4;

        Map<String, Object> stats = new HashMap<>();
        stats.put("availableEvents", availableEvents);
        stats.put("joinedEvents", joinedEvents); // Only show approved events as "Joined"
        stats.put("pendingEvents", pendingEvents);
        stats.put("peopleHelped", peopleHelped);
        stats.put("hoursVolunteered", hoursVolunteered);

        return stats;
    }

    @Cacheable(value = "users", key = "'allUsers'")
    public List<VolunteerDto> getAllVolunteers() {
        return volunteerRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "users", key = "#id")
    public VolunteerDto getVolunteerById(Long id) {
        VolunteerEntity volunteer = volunteerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found with id: " + id));
        return mapToDTO(volunteer);
    }

    public VolunteerDto getByEmail(String email) {
        VolunteerEntity volunteer = volunteerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return mapToDTO(volunteer);
    }

    @org.springframework.transaction.annotation.Transactional
    @CachePut(value = "users", key = "#id")
    public VolunteerDto updateVolunteer(Long id, VolunteerDto dto) {
        VolunteerEntity existing = volunteerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found with id: " + id));
        
        com.example.seva_connect_backend.entity.Role oldRole = existing.getRole();
        existing.setName(dto.getName());
        existing.setEmail(dto.getEmail());
        existing.setPhone(dto.getPhone());
        existing.setCity(dto.getCity());
        
        if (dto.getRole() != null) {
            com.example.seva_connect_backend.entity.Role newRole = com.example.seva_connect_backend.entity.Role.valueOf(dto.getRole().toUpperCase());
            existing.setRole(newRole);

            // Cleanup if promoted to ADMIN from VOLUNTEER
            if (oldRole == com.example.seva_connect_backend.entity.Role.VOLUNTEER && 
                newRole == com.example.seva_connect_backend.entity.Role.ADMIN) {
                volunteerRequestRepository.deleteByVolunteerId(id);
                volunteerEventRepository.deleteByVolunteerId(id);
                notificationRepository.deleteByUserId(id);
            }
        }
        
        return mapToDTO(volunteerRepository.save(existing));
    }

    @org.springframework.transaction.annotation.Transactional
    @CachePut(value = "users", key = "#id")
    public VolunteerDto miniUpdateVolunteer(Long id, VolunteerDto dto) {
        VolunteerEntity v = volunteerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found with id: " + id));
        
        com.example.seva_connect_backend.entity.Role oldRole = v.getRole();
        if (dto.getName() != null) v.setName(dto.getName());
        if (dto.getPhone() != null) v.setPhone(dto.getPhone());
        if (dto.getCity() != null) v.setCity(dto.getCity());
        
        if (dto.getRole() != null) {
            com.example.seva_connect_backend.entity.Role newRole = com.example.seva_connect_backend.entity.Role.valueOf(dto.getRole().toUpperCase());
            v.setRole(newRole);

            // Cleanup if promoted to ADMIN from VOLUNTEER
            if (oldRole == com.example.seva_connect_backend.entity.Role.VOLUNTEER && 
                newRole == com.example.seva_connect_backend.entity.Role.ADMIN) {
                volunteerRequestRepository.deleteByVolunteerId(id);
                volunteerEventRepository.deleteByVolunteerId(id);
                notificationRepository.deleteByUserId(id);
            }
        }
        
        return mapToDTO(volunteerRepository.save(v));
    }

    public boolean hasJoinedEvents(Long volunteerId) {
        return volunteerEventRepository.existsByVolunteer_Id(volunteerId);
    }

    public boolean existsById(Long id) {
        return volunteerRepository.existsById(id);
    }

    @org.springframework.transaction.annotation.Transactional
    @CacheEvict(value = "users", allEntries = true)
    public void deleteVolunteer(Long id) {
        if (!volunteerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Volunteer not found with id: " + id);
        }

        // 1. Delete associated notifications
        notificationRepository.deleteByUserId(id);

        // 2. Delete associated volunteer requests
        volunteerRequestRepository.deleteByVolunteerId(id);

        // 3. Delete associated event participations
        volunteerEventRepository.deleteByVolunteerId(id);

        // 4. Finally delete the user
        volunteerRepository.deleteById(id);
    }
}
