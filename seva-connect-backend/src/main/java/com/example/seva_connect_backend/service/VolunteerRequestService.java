package com.example.seva_connect_backend.service;

import com.example.seva_connect_backend.dto.VolunteerRequestDto;
import com.example.seva_connect_backend.entity.*;
import com.example.seva_connect_backend.exception.BadRequestException;
import com.example.seva_connect_backend.exception.DuplicateResourceException;
import com.example.seva_connect_backend.exception.ResourceNotFoundException;
import com.example.seva_connect_backend.repository.EventRepository;
import com.example.seva_connect_backend.repository.VolunteerEventRepository;
import com.example.seva_connect_backend.repository.VolunteerRepository;
import com.example.seva_connect_backend.repository.VolunteerRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class VolunteerRequestService {

    private final VolunteerRequestRepository volunteerRequestRepository;
    private final VolunteerRepository volunteerRepository;
    private final EventRepository eventRepository;
    private final VolunteerEventRepository volunteerEventRepository;
    private final NotificationService notificationService;

    public VolunteerRequestService(VolunteerRequestRepository volunteerRequestRepository,
            VolunteerRepository volunteerRepository,
            EventRepository eventRepository,
            VolunteerEventRepository volunteerEventRepository,
            NotificationService notificationService) {
        this.volunteerRequestRepository = volunteerRequestRepository;
        this.volunteerRepository = volunteerRepository;
        this.eventRepository = eventRepository;
        this.volunteerEventRepository = volunteerEventRepository;
        this.notificationService = notificationService;
    }

    private VolunteerRequestDto mapToDTO(VolunteerRequestEntity request) {
        VolunteerRequestDto dto = new VolunteerRequestDto();
        dto.setId(request.getId());
        dto.setVolunteerId(request.getVolunteer().getId());
        dto.setVolunteerName(request.getVolunteer().getName());
        dto.setVolunteerEmail(request.getVolunteer().getEmail());
        dto.setVolunteerPhone(request.getVolunteer().getPhone());
        dto.setVolunteerCity(request.getVolunteer().getCity());
        dto.setEventId(request.getEvent().getId());
        dto.setEventTitle(request.getEvent().getTitle());
        dto.setEventDescription(request.getEvent().getDescription());
        dto.setEventLocation(request.getEvent().getLocation());
        dto.setEventCategory(request.getEvent().getCategory());
        dto.setEventDate(request.getEvent().getEventDate());
        dto.setImageUrl(request.getEvent().getImageUrl());
        dto.setStatus(request.getStatus());

        if (request.getProcessedBy() != null) {
            dto.setProcessedByName(request.getProcessedBy().getName());
            dto.setProcessedByEmail(request.getProcessedBy().getEmail());
        }

        dto.setCreatedAt(request.getCreatedAt());
        dto.setUpdatedAt(request.getUpdatedAt());
        return dto;
    }

    public VolunteerRequestDto createRequest(String email, Long eventId) {
        validateEmail(email);
        validateId(eventId, "Event ID");

        VolunteerEntity volunteer = getVolunteerByEmail(email);
        EventEntity event = getEventById(eventId);

        // Check if event is in the past
        if (event.getEventDate() != null && event.getEventDate().isBefore(java.time.LocalDate.now())) {
            throw new BadRequestException("You cannot join an event that has already been completed.");
        }

        // Check if request already exists
        if (volunteerRequestRepository.existsByVolunteerIdAndEventId(volunteer.getId(), eventId)) {
            throw new DuplicateResourceException(
                    "You have already submitted a request for this event.");
        }

        // Check if already joined (via VolunteerEvent)
        if (volunteerEventRepository.existsByVolunteerIdAndEventId(volunteer.getId(), eventId)) {
            throw new BadRequestException("You are already a volunteer for this event.");
        }

        VolunteerRequestEntity request = new VolunteerRequestEntity();
        request.setVolunteer(volunteer);
        request.setEvent(event);
        request.setStatus(VolunteerRequestStatus.PENDING);

        VolunteerRequestDto saved = mapToDTO(volunteerRequestRepository.save(request));

        // Create notification for the user
        notificationService.createNotification(
                volunteer.getId(),
                "Your request to join '" + event.getTitle() + "' has been submitted and is pending approval.",
                NotificationType.SYSTEM,
                "/user/service/" + eventId);

        // TODO: In the future, we could add a notification for admin about new request
        // For now, admin can see the request in the dashboard

        return saved;
    }

    @Transactional(readOnly = true)
    public List<VolunteerRequestDto> getAllRequests() {
        return volunteerRequestRepository.findAll().stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<VolunteerRequestDto> getRequestsByStatus(VolunteerRequestStatus status) {
        return volunteerRequestRepository.findByStatus(status).stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<VolunteerRequestDto> getRequestsByVolunteer(String email) {
        validateEmail(email);
        VolunteerEntity volunteer = getVolunteerByEmail(email);
        return volunteerRequestRepository.findByVolunteerId(volunteer.getId()).stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<VolunteerRequestDto> getRequestsByEvent(Long eventId) {
        validateId(eventId, "Event ID");
        return volunteerRequestRepository.findByEventId(eventId).stream()
                .map(this::mapToDTO)
                .toList();
    }

    public VolunteerRequestDto approveRequest(Long requestId, String adminEmail) {
        VolunteerRequestEntity request = volunteerRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + requestId));

        if (request.getStatus() != VolunteerRequestStatus.PENDING) {
            throw new BadRequestException("Request is not pending.");
        }

        VolunteerEntity admin = getVolunteerByEmail(adminEmail);

        // Update status
        request.setStatus(VolunteerRequestStatus.APPROVED);
        request.setProcessedBy(admin);
        volunteerRequestRepository.save(request);

        // Add volunteer to event (create VolunteerEvent)
        VolunteerEventEntity volunteerEvent = new VolunteerEventEntity();
        volunteerEvent.setVolunteer(request.getVolunteer());
        volunteerEvent.setEvent(request.getEvent());
        volunteerEvent.setJoinedAt(LocalDateTime.now());
        volunteerEventRepository.save(volunteerEvent);

        // Create notification
        notificationService.createNotification(
                request.getVolunteer().getId(),
                "Your request to join '" + request.getEvent().getTitle() + "' was APPROVED by " + admin.getName() + ".",
                NotificationType.REQUEST_APPROVED,
                "/user/service/" + request.getEvent().getId());

        return mapToDTO(request);
    }

    public VolunteerRequestDto rejectRequest(Long requestId, String adminEmail) {
        VolunteerRequestEntity request = volunteerRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + requestId));

        if (request.getStatus() != VolunteerRequestStatus.PENDING) {
            throw new BadRequestException("Request is not pending.");
        }

        VolunteerEntity admin = getVolunteerByEmail(adminEmail);

        request.setStatus(VolunteerRequestStatus.REJECTED);
        request.setProcessedBy(admin);
        volunteerRequestRepository.save(request);

        // Create notification
        notificationService.createNotification(
                request.getVolunteer().getId(),
                "Your request to join '" + request.getEvent().getTitle() + "' was REJECTED by " + admin.getName() + ".",
                NotificationType.REQUEST_REJECTED,
                "/user/service/" + request.getEvent().getId());

        return mapToDTO(request);
    }

    @Transactional(readOnly = true)
    public VolunteerRequestDto getRequestById(Long requestId) {
        VolunteerRequestEntity request = volunteerRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + requestId));
        return mapToDTO(request);
    }

    // Helper methods
    private void validateEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new BadRequestException("Email must not be empty");
        }
    }

    private void validateId(Long id, String fieldName) {
        if (id == null || id <= 0) {
            throw new BadRequestException(fieldName + " must be a positive number");
        }
    }

    private VolunteerEntity getVolunteerByEmail(String email) {
        return volunteerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found with email: " + email));
    }

    private EventEntity getEventById(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
    }
}