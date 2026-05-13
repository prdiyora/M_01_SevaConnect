package com.example.seva_connect_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VolunteerDto {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String city;
    private String role;
    //private String password;
}