package com.example.seva_connect_backend.controller;

import com.example.seva_connect_backend.dto.EventDto;
import com.example.seva_connect_backend.service.EventService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // ✅ 1. GET ALL EVENTS (Public access)
    @GetMapping
    public List<EventDto> getAllEvents() {
        return eventService.getAllEvents();
    }

    // ✅ 2. GET EVENT BY ID (Public access)
    @GetMapping("/{id}")
    public EventDto getEventById(@PathVariable Long id) {
        return eventService.getEventById(id);
    }

    // ✅ 3. CREATE EVENT (Accessible only to ADMIN)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public EventDto createEvent(@RequestBody EventDto dto) {
        return eventService.createEvent(dto);
    }

    // ✅ 4. UPDATE EVENT (Accessible only to ADMIN)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public EventDto updateEvent(@PathVariable Long id, @RequestBody EventDto dto) {
        return eventService.updateEvent(id, dto);
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
        return eventService.getEventsByCategory(category);
    }

    // ✅ 7. SEARCH BY NAME (Public access)
    @GetMapping("/search")
    public List<EventDto> searchEvents(@RequestParam String keyword) {
        return eventService.searchEvents(keyword);
    }
}
