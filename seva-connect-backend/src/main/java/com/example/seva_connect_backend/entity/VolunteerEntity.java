package com.example.seva_connect_backend.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jdk.jfr.Event;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "volunteer")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class VolunteerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String email;

    private String phone;

    private String city;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

}


//CREATE TABLE volunteer (
//   id BIGINT PRIMARY KEY AUTO_INCREMENT,
//name VARCHAR(100) NOT NULL,
//email VARCHAR(150) UNIQUE,
//phone VARCHAR(15),
//created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//);
