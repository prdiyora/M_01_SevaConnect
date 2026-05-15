package com.example.seva_connect_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
public class EventDto {

    @com.fasterxml.jackson.annotation.JsonProperty("id")
    @com.fasterxml.jackson.annotation.JsonAlias({"id", "eventId"})
    private Long id;

    @com.fasterxml.jackson.annotation.JsonProperty("eventname")
    @com.fasterxml.jackson.annotation.JsonAlias({"eventname", "eventName", "title"})
    private String eventname;

    @com.fasterxml.jackson.annotation.JsonProperty("description")
    private String description;

    @com.fasterxml.jackson.annotation.JsonProperty("category")
    private String category;

    @com.fasterxml.jackson.annotation.JsonProperty("location")
    private String location;
    
    @com.fasterxml.jackson.annotation.JsonProperty("eventDate")
    @com.fasterxml.jackson.annotation.JsonAlias({"eventDate", "event_date"})
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd")
    private java.time.LocalDate eventDate;
    
    @com.fasterxml.jackson.annotation.JsonProperty("imageUrl")
    @com.fasterxml.jackson.annotation.JsonAlias({"imageUrl", "image_url"})
    private String imageUrl;
    
    @com.fasterxml.jackson.annotation.JsonProperty("visible")
    private Boolean visible;

    // Explicitly override getter to avoid any "is" vs "get" issues with Jackson
    @com.fasterxml.jackson.annotation.JsonProperty("visible")
    public Boolean getVisible() {
        return visible;
    }

    public void setVisible(Boolean visible) {
        this.visible = visible;
    }
}
