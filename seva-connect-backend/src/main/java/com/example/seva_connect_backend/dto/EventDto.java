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

    @com.fasterxml.jackson.annotation.JsonProperty("id")
    private Long id;

    @com.fasterxml.jackson.annotation.JsonProperty("eventname")
    private String eventname;

    @com.fasterxml.jackson.annotation.JsonProperty("description")
    private String description;

    @com.fasterxml.jackson.annotation.JsonProperty("category")
    private String category;

    @com.fasterxml.jackson.annotation.JsonProperty("location")
    private String location;
    
    @com.fasterxml.jackson.annotation.JsonProperty("eventDate")
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd")
    private java.time.LocalDate eventDate;
    
    @com.fasterxml.jackson.annotation.JsonProperty("imageUrl")
    private String imageUrl;
    
    @com.fasterxml.jackson.annotation.JsonProperty("visible")
    private Boolean visible;

    // Standard getters/setters for visible to be safe
    public Boolean getVisible() {
        return visible;
    }

    public void setVisible(Boolean visible) {
        this.visible = visible;
    }
}
