package com.example.seva_connect_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VolunteerEventDto {

    private Long id;

    // 🔹 IDs
    private Long volunteerId;
    private Long eventId;

    // 🔹 Volunteer Info
    private String volunteerName;
    private String volunteerEmail;
    private String volunteerPhone;

    // 🔹 Event Info
    private String eventTitle;
    private String eventDescription;
    private String eventLocation;
    private LocalDate eventDate;
    private String imageUrl;

    // 🔹 Meta
    private LocalDateTime joinedAt;
}