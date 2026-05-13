package com.example.seva_connect_backend.service;

import com.example.seva_connect_backend.dto.VolunteerRequestDto;
import com.example.seva_connect_backend.entity.Role;
import com.example.seva_connect_backend.entity.VolunteerRequestEntity;
import com.example.seva_connect_backend.entity.VolunteerRequestStatus;
import com.example.seva_connect_backend.repository.EventRepository;
import com.example.seva_connect_backend.repository.VolunteerEventRepository;
import com.example.seva_connect_backend.repository.VolunteerRepository;
import com.example.seva_connect_backend.repository.VolunteerRequestRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminStatsService {

    private final VolunteerRepository volunteerRepository;
    private final EventRepository eventRepository;
    private final VolunteerEventRepository volunteerEventRepository;
    private final VolunteerRequestRepository volunteerRequestRepository;

    public AdminStatsService(VolunteerRepository volunteerRepository,
            EventRepository eventRepository,
            VolunteerEventRepository volunteerEventRepository,
            VolunteerRequestRepository volunteerRequestRepository) {
        this.volunteerRepository = volunteerRepository;
        this.eventRepository = eventRepository;
        this.volunteerEventRepository = volunteerEventRepository;
        this.volunteerRequestRepository = volunteerRequestRepository;
    }

    /**
     * Returns dashboard statistics for admin.
     * 
     * @return map containing totalVolunteers, totalEvents, pendingRequests,
     *         approvedRequests, totalImpact, and recentRequests
     */
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Core Stats
        long totalVolunteers = volunteerRepository.countByRole(Role.VOLUNTEER);
        long totalEvents = eventRepository.count();
        long pendingRequests = volunteerRequestRepository.countByStatus(VolunteerRequestStatus.PENDING);
        long approvedRequests = volunteerRequestRepository.countByStatus(VolunteerRequestStatus.APPROVED);
        long totalRequests = volunteerRequestRepository.count();

        stats.put("totalVolunteers", totalVolunteers);
        stats.put("totalEvents", totalEvents);
        stats.put("pendingRequests", pendingRequests);
        stats.put("approvedRequests", approvedRequests);

        // Total Impact (Total participations)
        long totalImpact = volunteerEventRepository.count();
        stats.put("totalImpact", totalImpact);

        // --- Useful Advanced Data ---
        
        // 1. Conversion Rate (Approved / Total Requests)
        double conversionRate = totalRequests > 0 ? (double) approvedRequests / totalRequests * 100.0 : 0.0;
        stats.put("conversionRate", Math.round(conversionRate * 10.0) / 10.0);

        // 2. Engagement Score (Participations per Event)
        double engagementScore = totalEvents > 0 ? (double) totalImpact / totalEvents : 0.0;
        stats.put("engagementScore", Math.round(engagementScore * 10.0) / 10.0);

        // 3. Community Reach (Active Volunteers / Total Volunteers)
        long activeVolunteers = volunteerEventRepository.countUniqueVolunteers();
        stats.put("activeVolunteers", activeVolunteers);
        
        double communityReach = totalVolunteers > 0 ? (double) activeVolunteers / totalVolunteers * 100.0 : 0.0;
        stats.put("communityReach", Math.round(communityReach * 10.0) / 10.0);

        // Recent Activity Preview (last 5 volunteer requests)
        List<VolunteerRequestEntity> recentRequests = volunteerRequestRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))).getContent();

        List<VolunteerRequestDto> recentRequestsDtos = recentRequests.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        stats.put("recentRequests", recentRequestsDtos);

        return stats;
    }

    /**
     * Maps VolunteerRequestEntity to VolunteerRequestDto.
     */
    private VolunteerRequestDto mapToDTO(VolunteerRequestEntity request) {
        VolunteerRequestDto dto = new VolunteerRequestDto();
        dto.setId(request.getId());
        dto.setVolunteerId(request.getVolunteer().getId());
        dto.setVolunteerName(request.getVolunteer().getName());
        dto.setVolunteerEmail(request.getVolunteer().getEmail());
        dto.setVolunteerPhone(request.getVolunteer().getPhone());
        dto.setEventId(request.getEvent().getId());
        dto.setEventTitle(request.getEvent().getTitle());
        dto.setEventDescription(request.getEvent().getDescription());
        dto.setEventLocation(request.getEvent().getLocation());
        dto.setEventCategory(request.getEvent().getCategory());
        dto.setEventDate(request.getEvent().getEventDate());
        dto.setImageUrl(request.getEvent().getImageUrl());
        dto.setStatus(request.getStatus());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setUpdatedAt(request.getUpdatedAt());
        return dto;
    }

    /**
     * Returns events grouped by category with counts.
     * 
     * @return list of Object arrays where each array contains category and count
     */
    public List<Object[]> getEventsByCategoryStats() {
        return eventRepository.countEventsByCategory();
    }

    /**
     * Returns monthly registration counts for the current year.
     * 
     * @return map of month name to registration count
     */
    public List<Object[]> getMonthlyRegistrationStats() {
        return volunteerEventRepository.countRegistrationsByMonth();
    }
}
