package com.example.seva_connect_backend.controller;

import com.example.seva_connect_backend.dto.VolunteerDto;
import com.example.seva_connect_backend.repository.VolunteerRepository;
import com.example.seva_connect_backend.service.VolunteerService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/volunteers")
public class VolunteerController {

    private final VolunteerService volunteerService;
    private final com.example.seva_connect_backend.service.AuthService authService;

    public VolunteerController(VolunteerService volunteerService, com.example.seva_connect_backend.service.AuthService authService) {
        this.volunteerService = volunteerService;
        this.authService = authService;
    }

    // ✅ CREATE (Admin manual entry)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> createVolunteer(@RequestBody com.example.seva_connect_backend.dto.RegisterRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(dto));
    }

    // ✅ GET ALL
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<VolunteerDto>> getAllVolunteers() {
        return ResponseEntity.ok(volunteerService.getAllVolunteers());
    }

    // ✅ GET BY ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VolunteerDto> getVolunteerById(@PathVariable Long id) {
        return ResponseEntity.ok(volunteerService.getVolunteerById(id));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('VOLUNTEER','ADMIN')")
    public ResponseEntity<VolunteerDto> getMyProfile(Authentication authentication) {
        String email = authentication.getName(); // JWT mathi aave chhe
        return ResponseEntity.ok(volunteerService.getByEmail(email));
    }

    @GetMapping("/my/stats")
    @PreAuthorize("hasAnyRole('VOLUNTEER','ADMIN')")
    public ResponseEntity<Map<String, Object>> getMyStats(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(volunteerService.getVolunteerStats(email));
    }

    @PatchMapping("/me")
    @PreAuthorize("hasAnyRole('VOLUNTEER','ADMIN')")
    public ResponseEntity<VolunteerDto> updateMyProfile(Authentication authentication, @RequestBody VolunteerDto dto) {
        String email = authentication.getName();
        VolunteerDto current = volunteerService.getByEmail(email);
        return ResponseEntity.ok(volunteerService.miniUpdateVolunteer(current.getId(), dto));
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VolunteerDto> updateVolunteer(@PathVariable Long id, @RequestBody VolunteerDto dto) {
        return ResponseEntity.ok(volunteerService.updateVolunteer(id, dto));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VolunteerDto> miniUpdateVolunteer(@PathVariable Long id, @RequestBody VolunteerDto dto) {
        return ResponseEntity.ok(volunteerService.miniUpdateVolunteer(id, dto));
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteVolunteer(@PathVariable Long id) {
        if (!volunteerService.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Volunteer not found"));
        }

        volunteerService.deleteVolunteer(id);
        return ResponseEntity.ok(Map.of("message", "Volunteer deleted successfully"));
    }

}
