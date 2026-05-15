package com.example.seva_connect_backend.dto;

import com.example.seva_connect_backend.entity.VolunteerRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VolunteerRequestDto {

    private Long id;

    private Long volunteerId;
    private String volunteerName;
    private String volunteerEmail;
    private String volunteerPhone;
    private String volunteerCity;

    private Long eventId;
    private String eventTitle;
    private String eventDescription;
    private String eventLocation;
    private String eventCategory;

    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate eventDate;

    private String imageUrl;

    private VolunteerRequestStatus status;

    private String processedByName;
    private String processedByEmail;

    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    }