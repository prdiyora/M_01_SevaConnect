package com.example.seva_connect_backend.service.impl;

import com.example.seva_connect_backend.dto.AuthResponseDto;
import com.example.seva_connect_backend.dto.RegisterRequestDto;
import com.example.seva_connect_backend.entity.Role;
import com.example.seva_connect_backend.entity.VolunteerEntity;
import com.example.seva_connect_backend.repository.VolunteerRepository;
import com.example.seva_connect_backend.security.JwtUtil;
import com.example.seva_connect_backend.service.AuthService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final VolunteerRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(VolunteerRepository repository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ✅ REGISTER
    @Override
    @CacheEvict(value = "users", allEntries = true)
    public String register(RegisterRequestDto request) {

        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        VolunteerEntity user = new VolunteerEntity();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setCity(request.getCity());

        // 🔐 Encrypt password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // ✅ Set role (Default to VOLUNTEER if not specified)
        if (request.getRole() != null) {
            try {
                user.setRole(Role.valueOf(request.getRole().toUpperCase()));
            } catch (IllegalArgumentException e) {
                user.setRole(Role.VOLUNTEER);
            }
        } else {
            user.setRole(Role.VOLUNTEER);
        }

        repository.save(user);

        return "User registered successfully";
    }

    // ✅ LOGIN (UPDATED)
    @Override
    public AuthResponseDto login(String email, String password) {

        // 1. Find user
        VolunteerEntity user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Check password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // 3. Generate JWT token
        String token = jwtUtil.generateToken(user);

        // 4. Return structured response
        return new AuthResponseDto(
                token,
                user.getEmail(),
                user.getRole().name()
        );
    }
}