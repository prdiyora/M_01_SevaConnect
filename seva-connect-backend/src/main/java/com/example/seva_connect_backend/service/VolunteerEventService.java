package com.example.seva_connect_backend.service;

import com.example.seva_connect_backend.dto.VolunteerEventDto;
import com.example.seva_connect_backend.entity.EventEntity;
import com.example.seva_connect_backend.entity.NotificationType;
import com.example.seva_connect_backend.entity.VolunteerEntity;
import com.example.seva_connect_backend.entity.VolunteerEventEntity;
import com.example.seva_connect_backend.exception.BadRequestException;
import com.example.seva_connect_backend.exception.DuplicateResourceException;
import com.example.seva_connect_backend.exception.ResourceNotFoundException;
import com.example.seva_connect_backend.repository.EventRepository;
import com.example.seva_connect_backend.repository.VolunteerEventRepository;
import com.example.seva_connect_backend.repository.VolunteerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class VolunteerEventService {

    private final VolunteerEventRepository volunteerEventRepository;
    private final VolunteerRepository volunteerRepository;
    private final EventRepository eventRepository;
    private final NotificationService notificationService;

    public VolunteerEventService(VolunteerEventRepository volunteerEventRepository,
            VolunteerRepository volunteerRepository,
            EventRepository eventRepository,
            NotificationService notificationService) {
        this.volunteerEventRepository = volunteerEventRepository;
        this.volunteerRepository = volunteerRepository;
        this.eventRepository = eventRepository;
        this.notificationService = notificationService;
    }

    private VolunteerEventDto mapToDTO(VolunteerEventEntity e) {
        VolunteerEventDto dto = new VolunteerEventDto();
        dto.setId(e.getId());
        dto.setVolunteerId(e.getVolunteer().getId());
        dto.setEventId(e.getEvent().getId());
        dto.setVolunteerName(e.getVolunteer().getName());
        dto.setVolunteerEmail(e.getVolunteer().getEmail());
        dto.setVolunteerPhone(e.getVolunteer().getPhone());
        dto.setEventTitle(e.getEvent().getTitle());
        dto.setEventDescription(e.getEvent().getDescription());
        dto.setEventLocation(e.getEvent().getLocation());
        dto.setEventDate(e.getEvent().getEventDate());
        dto.setImageUrl(e.getEvent().getImageUrl());
        dto.setJoinedAt(e.getJoinedAt());
        return dto;
    }

    public VolunteerEventDto joinEvent(String email, Long eventId) {
        validateEmail(email);
        validateId(eventId, "Event ID");

        VolunteerEntity volunteer = getVolunteerByEmail(email);
        EventEntity event = getEventById(eventId);

        if (volunteerEventRepository.existsByVolunteerIdAndEventId(volunteer.getId(), eventId)) {
            throw new DuplicateResourceException(
                    "Volunteer '" + volunteer.getName() +
                            "' already joined event '" + event.getTitle() + "'");
        }

        VolunteerEventEntity ve = new VolunteerEventEntity();
        ve.setVolunteer(volunteer);
        ve.setEvent(event);
        ve.setJoinedAt(LocalDateTime.now());

        VolunteerEventDto saved = mapToDTO(volunteerEventRepository.save(ve));

        // Create notification for the user
        notificationService.createNotification(
                volunteer.getId(),
                "You have successfully joined the event '" + event.getTitle() + "'",
                NotificationType.INFO);

        // Optionally create a notification for admin (could be added later)
        // For now, we'll just notify the user

        return saved;
    }

    @Transactional(readOnly = true)
    public List<VolunteerEventDto> getAll() {
        return volunteerEventRepository.findAll().stream().map(this::mapToDTO).toList();
    }

    @Transactional(readOnly = true)
    public VolunteerEventDto getById(Long id) {
        validateId(id, "Registration ID");
        return mapToDTO(volunteerEventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id: " + id)));
    }

    @Transactional(readOnly = true)
    public List<VolunteerEventDto> getByVolunteer(Long volunteerId) {
        validateId(volunteerId, "Volunteer ID");
        if (!volunteerRepository.existsById(volunteerId)) {
            throw new ResourceNotFoundException("Volunteer not found with id: " + volunteerId);
        }
        return volunteerEventRepository.findByVolunteerId(volunteerId)
                .stream().map(this::mapToDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<VolunteerEventDto> getByEvent(Long eventId) {
        validateId(eventId, "Event ID");
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event not found with id: " + eventId);
        }
        return volunteerEventRepository.findByEventId(eventId)
                .stream().map(this::mapToDTO).toList();
    }

    public void cancel(Long id) {
        validateId(id, "Registration ID");
        if (!volunteerEventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Registration not found with id: " + id);
        }
        volunteerEventRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean isJoined(String email, Long eventId) {
        validateEmail(email);
        validateId(eventId, "Event ID");

        VolunteerEntity volunteer = getVolunteerByEmail(email);
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event not found with id: " + eventId);
        }
        return volunteerEventRepository.existsByVolunteerIdAndEventId(volunteer.getId(), eventId);
    }

    @Transactional(readOnly = true)
    public List<VolunteerEventDto> getMyEvents(String email) {
        validateEmail(email);
        VolunteerEntity volunteer = getVolunteerByEmail(email);
        return volunteerEventRepository.findByVolunteerId(volunteer.getId())
                .stream().map(this::mapToDTO).toList();
    }

    public void cancelByVolunteerAndEvent(String email, Long eventId) {
        validateEmail(email);
        validateId(eventId, "Event ID");

        VolunteerEntity volunteer = getVolunteerByEmail(email);

        VolunteerEventEntity registration = volunteerEventRepository
                .findByVolunteerId(volunteer.getId()).stream()
                .filter(ve -> ve.getEvent().getId().equals(eventId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Registration not found for volunteer and event"));

        volunteerEventRepository.delete(registration);
    }

    private void validateEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new BadRequestException("Email must not be empty");
        }
    }

    private void validateId(Long id, String fieldName) {
        if (id == null) {
            throw new BadRequestException(fieldName + " must not be null");
        }
    }

    private VolunteerEntity getVolunteerByEmail(String email) {
        return volunteerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private EventEntity getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }
}
