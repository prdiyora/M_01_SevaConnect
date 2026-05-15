package com.example.seva_connect_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.catalina.Role;

import java.util.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "event")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 50)
    private String category;

    @Column(length = 100)
    private String location;

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    @Column(nullable = false)
    private boolean visible = true;

    // Use proper Date type
    @Column(name = "event_date")
    private LocalDate eventDate;

    // Proper timestamp handling
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;


    // Auto timestamp
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}

//CREATE TABLE event (
// id BIGINT PRIMARY KEY AUTO_INCREMENT,
//title VARCHAR(150) NOT NULL,
//description TEXT,
//category VARCHAR(50),
//location VARCHAR(100),
//event_date DATE,
//created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//);
