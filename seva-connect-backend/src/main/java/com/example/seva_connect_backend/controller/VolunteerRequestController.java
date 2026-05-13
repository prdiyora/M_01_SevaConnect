package com.example.seva_connect_backend.controller;

import com.example.seva_connect_backend.dto.VolunteerRequestDto;
import com.example.seva_connect_backend.entity.VolunteerRequestStatus;
import com.example.seva_connect_backend.service.VolunteerRequestService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/volunteer-requests")
public class VolunteerRequestController {

    private final VolunteerRequestService volunteerRequestService;

    public VolunteerRequestController(VolunteerRequestService volunteerRequestService) {
        this.volunteerRequestService = volunteerRequestService;
    }

    // ✅ User: Request to join an event
    @PostMapping("/join/{eventId}")
    @PreAuthorize("hasAnyRole('VOLUNTEER', 'ADMIN')")
    public VolunteerRequestDto createRequest(
            @PathVariable Long eventId,
            Authentication authentication) {
        String email = authentication.getName();
        return volunteerRequestService.createRequest(email, eventId);
    }

    // ✅ User: Get my requests
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('VOLUNTEER', 'ADMIN')")
    public List<VolunteerRequestDto> getMyRequests(Authentication authentication) {
        String email = authentication.getName();
        return volunteerRequestService.getRequestsByVolunteer(email);
    }

    // ✅ Admin: Get all requests
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<VolunteerRequestDto> getAllRequests() {
        return volunteerRequestService.getAllRequests();
    }

    // ✅ Admin: Get requests by status
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<VolunteerRequestDto> getRequestsByStatus(@PathVariable VolunteerRequestStatus status) {
        return volunteerRequestService.getRequestsByStatus(status);
    }

    // ✅ Admin: Get requests by event
    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<VolunteerRequestDto> getRequestsByEvent(@PathVariable Long eventId) {
        return volunteerRequestService.getRequestsByEvent(eventId);
    }

    // ✅ Admin: Approve request
    @PutMapping("/{requestId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public VolunteerRequestDto approveRequest(
            @PathVariable Long requestId,
            Authentication authentication) {
        String adminEmail = authentication.getName();
        return volunteerRequestService.approveRequest(requestId, adminEmail);
    }

    // ✅ Admin: Reject request
    @PutMapping("/{requestId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public VolunteerRequestDto rejectRequest(
            @PathVariable Long requestId,
            Authentication authentication) {
        String adminEmail = authentication.getName();
        return volunteerRequestService.rejectRequest(requestId, adminEmail);
    }

    // ✅ Admin: Get request by ID
    @GetMapping("/{requestId}")
    @PreAuthorize("hasRole('ADMIN')")
    public VolunteerRequestDto getRequestById(@PathVariable Long requestId) {
        return volunteerRequestService.getRequestById(requestId);
    }
}