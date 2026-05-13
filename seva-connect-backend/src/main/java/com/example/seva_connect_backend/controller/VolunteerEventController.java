package com.example.seva_connect_backend.controller;

import com.example.seva_connect_backend.dto.VolunteerEventDto;
import com.example.seva_connect_backend.repository.VolunteerEventRepository;
import com.example.seva_connect_backend.service.VolunteerEventService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/volunteer-events")
public class VolunteerEventController {

    private final VolunteerEventService volunteerEventService;

    public VolunteerEventController(VolunteerEventService volunteerEventService) {
        this.volunteerEventService = volunteerEventService;
    }

    // ✅ 1. REGISTER (JOIN EVENT)
    @PostMapping("/join/{eventId}")
    @PreAuthorize("hasAnyRole('VOLUNTEER', 'ADMIN')")
    public VolunteerEventDto joinEvent(
            @PathVariable Long eventId,
            Authentication authentication) {
        String email = authentication.getName();
        return volunteerEventService.joinEvent(email, eventId);
    }

    // ✅ 2. GET ALL REGISTRATIONS
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<VolunteerEventDto> getAll() {
        return volunteerEventService.getAll();
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('VOLUNTEER', 'ADMIN')")
    public List<VolunteerEventDto> getMyEvents(Authentication authentication) {
        String email = authentication.getName();
        return volunteerEventService.getMyEvents(email);
    }

    // ✅ 3. GET BY ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public VolunteerEventDto getById(@PathVariable Long id) {
        return volunteerEventService.getById(id);
    }

    // ✅ 4. GET EVENTS BY VOLUNTEER
    @GetMapping("/volunteer/{volunteerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<VolunteerEventDto> getByVolunteer(@PathVariable Long volunteerId) {
        return volunteerEventService.getByVolunteer(volunteerId);
    }

    // ✅ 5. GET VOLUNTEERS BY EVENT
    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<VolunteerEventDto> getByEvent(@PathVariable Long eventId) {
        return volunteerEventService.getByEvent(eventId);
    }

    @GetMapping("/check/{eventId}")
    public boolean isJoined(@PathVariable Long eventId, Authentication authentication) {
        String email = authentication.getName();
        return volunteerEventService.isJoined(email, eventId);
    }

    // ✅ 6. CANCEL REGISTRATION
    @DeleteMapping("/cancel/{id}")
    @PreAuthorize("hasAnyRole('VOLUNTEER', 'ADMIN')")
    public String cancel(@PathVariable Long id) {
        volunteerEventService.cancel(id);
        return "Cancelled successfully";
    }
}