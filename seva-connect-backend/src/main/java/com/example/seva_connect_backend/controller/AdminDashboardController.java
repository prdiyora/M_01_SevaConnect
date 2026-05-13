package com.example.seva_connect_backend.controller;

import com.example.seva_connect_backend.service.AdminStatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final AdminStatsService adminStatsService;

    public AdminDashboardController(AdminStatsService adminStatsService) {
        this.adminStatsService = adminStatsService;
    }

    /**
     * Legacy endpoint for dashboard stats.
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStatsLegacy() {
        return ResponseEntity.ok(adminStatsService.getDashboardStats());
    }

    /**
     * New high-impact dashboard stats endpoint.
     * GET /admin/stats/dashboard
     */
    @GetMapping("/stats/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(adminStatsService.getDashboardStats());
    }
}
