package com.example.seva_connect_backend.controller;

import com.example.seva_connect_backend.dto.EventDto;
import com.example.seva_connect_backend.service.EventService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@lombok.extern.slf4j.Slf4j
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // ✅ 1. GET ALL VISIBLE EVENTS (Public access)
    @GetMapping
    public List<EventDto> getAllEvents() {
        log.info("GET /events called");
        return eventService.getAllVisibleEvents();
    }

    // ✅ 1b. GET ALL EVENTS (Admin access)
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public List<EventDto> getAllEventsForAdmin() {
        log.info("GET /events/admin called (ADMIN)");
        try {
            List<EventDto> events = eventService.getAllEvents();
            log.info("GET /events/admin returning {} events", events.size());
            return events;
        } catch (Exception e) {
            log.error("Error in GET /events/admin", e);
            throw e;
        }
    }

    // ✅ 2. GET EVENT BY ID (Public access)
    @GetMapping("/{id}")
    public EventDto getEventById(@PathVariable Long id) {
        log.info("GET /events/{} called", id);
        return eventService.getEventById(id);
    }

    // ✅ 3. CREATE EVENT (Accessible only to ADMIN)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public EventDto createEvent(@RequestBody EventDto dto) {
        log.info("POST /events called with dto: {}", dto);
        return eventService.createEvent(dto);
    }

    // ✅ 4. UPDATE EVENT (Accessible only to ADMIN)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public EventDto updateEvent(@PathVariable Long id, @RequestBody EventDto dto) {
        log.info("PUT /events/{} called with dto: {}", id, dto);
        try {
            EventDto updated = eventService.updateEvent(id, dto);
            log.info("PUT /events/{} successful", id);
            return updated;
        } catch (Exception e) {
            log.error("Error updating event {}", id, e);
            throw e;
        }
    }

    // ✅ 5. DELETE EVENT (Accessible only to ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return "Event deleted successfully";
    }

    // ✅ 6. GET BY CATEGORY (Public access)
    @GetMapping("/category/{category}")
    public List<EventDto> getByCategory(@PathVariable String category) {
        return eventService.getVisibleEventsByCategory(category);
    }

    // ✅ 7. SEARCH BY NAME (Public access)
    @GetMapping("/search")
    public List<EventDto> searchEvents(@RequestParam String keyword) {
        return eventService.searchVisibleEvents(keyword);
    }
}
