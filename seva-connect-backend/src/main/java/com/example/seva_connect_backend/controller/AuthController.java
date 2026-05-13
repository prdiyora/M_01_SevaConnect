package com.example.seva_connect_backend.controller;

import com.example.seva_connect_backend.dto.AuthResponseDto;
import com.example.seva_connect_backend.dto.LoginRequestDto;
import com.example.seva_connect_backend.dto.RegisterRequestDto;
import com.example.seva_connect_backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ✅ REGISTER
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequestDto request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginRequestDto request) {
        return ResponseEntity.ok(
                authService.login(request.getEmail(), request.getPassword())
        );
    }
}