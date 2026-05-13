package com.example.seva_connect_backend.controller;

import com.example.seva_connect_backend.service.AdminStatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/admin/reports")
@PreAuthorize("hasRole('ADMIN')")
public class AdminReportController {

    private final AdminStatsService adminStatsService;

    public AdminReportController(AdminStatsService adminStatsService) {
        this.adminStatsService = adminStatsService;
    }

    // GET /admin/reports — overall platform summary
    @GetMapping
    public ResponseEntity<Map<String, Object>> getReports() {
        return ResponseEntity.ok(adminStatsService.getDashboardStats());
    }

    // GET /admin/reports/events-by-category
    @GetMapping("/events-by-category")
    public ResponseEntity<?> getEventsByCategory() {
        return ResponseEntity.ok(adminStatsService.getEventsByCategoryStats());
    }

    // GET /admin/reports/monthly-growth
    @GetMapping("/monthly-growth")
    public ResponseEntity<?> getMonthlyGrowth() {
        return ResponseEntity.ok(adminStatsService.getMonthlyRegistrationStats());
    }
}
