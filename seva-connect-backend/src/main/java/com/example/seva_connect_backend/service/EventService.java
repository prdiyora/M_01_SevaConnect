package com.example.seva_connect_backend.service;

import com.example.seva_connect_backend.dto.EventDto;
import com.example.seva_connect_backend.entity.EventEntity;
import com.example.seva_connect_backend.exception.BadRequestException;
import com.example.seva_connect_backend.exception.ResourceNotFoundException;
import com.example.seva_connect_backend.repository.EventRepository;
import com.example.seva_connect_backend.repository.VolunteerEventRepository;
import com.example.seva_connect_backend.repository.VolunteerRequestRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class EventService {

    private final EventRepository eventRepository;
    private final VolunteerEventRepository volunteerEventRepository;
    private final VolunteerRequestRepository volunteerRequestRepository;

    public EventService(EventRepository eventRepository,
                        VolunteerEventRepository volunteerEventRepository,
                        VolunteerRequestRepository volunteerRequestRepository) {
        this.eventRepository = eventRepository;
        this.volunteerEventRepository = volunteerEventRepository;
        this.volunteerRequestRepository = volunteerRequestRepository;
    }

    private EventDto mapToDTO(EventEntity event) {
        if (event == null) return null;
        return EventDto.builder()
                .id(event.getId())
                .eventname(event.getTitle() != null ? event.getTitle() : "Untitled Event")
                .description(event.getDescription())
                .category(event.getCategory() != null ? event.getCategory() : "General")
                .location(event.getLocation() != null ? event.getLocation() : "TBD")
                .eventDate(event.getEventDate())
                .imageUrl(event.getImageUrl())
                .visible(event.getVisible() != null ? event.getVisible() : true)
                .build();
    }

    private EventEntity mapToEntity(EventDto dto) {
        EventEntity event = new EventEntity();
        event.setTitle(dto.getEventname());
        event.setDescription(dto.getDescription());
        event.setCategory(dto.getCategory());
        event.setLocation(dto.getLocation());
        event.setEventDate(dto.getEventDate());
        event.setImageUrl(dto.getImageUrl());
        event.setVisible(dto.getVisible() != null ? dto.getVisible() : true);
        return event;
    }

    public List<EventDto> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<EventDto> getAllVisibleEvents() {
        return eventRepository.findByVisibleTrue()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public EventDto getEventById(Long id) {
        EventEntity event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return mapToDTO(event);
    }

    public EventDto createEvent(EventDto dto) {
        EventEntity entity = mapToEntity(dto);
        // Default to visible if not specified (though DTO boolean defaults to false, so we should be careful)
        // If it's a new event, we might want it visible by default.
        // But mapToEntity uses dto.isVisible(), which is false by default for boolean primitives.
        // However, the entity itself has visible = true as default.
        // Let's ensure it's handled correctly.
        EventEntity saved = eventRepository.save(entity);
        return mapToDTO(saved);
    }

    public EventDto updateEvent(Long id, EventDto dto) {
        EventEntity existing = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        existing.setTitle(dto.getEventname());
        existing.setDescription(dto.getDescription());
        existing.setCategory(dto.getCategory());
        existing.setLocation(dto.getLocation());
        existing.setEventDate(dto.getEventDate());
        existing.setImageUrl(dto.getImageUrl());
        
        // Explicitly handle visibility to ensure it's not bypassed
        if (dto.getVisible() != null) {
            existing.setVisible(dto.getVisible());
        } else if (existing.getVisible() == null) {
            existing.setVisible(true); // Default to true if somehow null
        }
        
        EventEntity saved = eventRepository.save(existing);
        return mapToDTO(saved);
    }

    @Transactional
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with id: " + id);
        }
        
        // 🔹 1. First delete all registrations for this event
        volunteerEventRepository.deleteByEventId(id);
        
        // 🔹 2. Then delete all pending/rejected requests for this event
        volunteerRequestRepository.deleteByEventId(id);
        
        // 🔹 3. Finally delete the event itself
        eventRepository.deleteById(id);
    }

    public List<EventDto> getEventsByCategory(String category) {
        return eventRepository.findByCategory(category)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<EventDto> getVisibleEventsByCategory(String category) {
        return eventRepository.findByVisibleTrueAndCategory(category)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<EventDto> searchEvents(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }
        return eventRepository.findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<EventDto> searchVisibleEvents(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }
        return eventRepository.findByVisibleTrueAndTitleContainingIgnoreCase(keyword)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
}
