package com.example.seva_connect_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "volunteer_events",
        uniqueConstraints = @UniqueConstraint(columnNames = {"volunteer_id", "event_id"}))
// Same user ekaj event ma 2 vaar join na kare
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VolunteerEventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔹 Many-to-One → Volunteer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "volunteer_id", nullable = false) //👉 DB clean & readable bane
    private VolunteerEntity volunteer;

    // 🔹 Many-to-One → Event
    @ManyToOne(fetch = FetchType.LAZY) // Data jarur hoy tyare j load thase
    @JoinColumn(name = "event_id", nullable = false)
    private EventEntity event;

    // 🔹 Meta Field
    @Column(name = "joined_at")
    private LocalDateTime joinedAt;
}