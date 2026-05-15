package com.example.seva_connect_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventDto {

    private Long id;
    private String eventname;
    private String description;
    private String category;
    private String location;
    private java.time.LocalDate eventDate;
    private String imageUrl;
    private Boolean visible;
}
