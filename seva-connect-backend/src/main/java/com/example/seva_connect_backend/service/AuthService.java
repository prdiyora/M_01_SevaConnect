package com.example.seva_connect_backend.service;

import com.example.seva_connect_backend.dto.AuthRequestDto;
import com.example.seva_connect_backend.dto.AuthResponseDto;
import com.example.seva_connect_backend.dto.RegisterRequestDto;
import com.example.seva_connect_backend.entity.VolunteerEntity;


import com.example.seva_connect_backend.dto.AuthResponseDto;
import com.example.seva_connect_backend.dto.RegisterRequestDto;

public interface AuthService {

    String register(RegisterRequestDto request);

    // ✅ MUST be AuthResponseDto
    AuthResponseDto login(String email, String password);
}
