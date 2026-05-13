package com.example.seva_connect_backend.controller;

import com.example.seva_connect_backend.dto.NotificationDto;
import com.example.seva_connect_backend.service.NotificationService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // ✅ User: Get my notifications
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('VOLUNTEER', 'ADMIN')")
    public List<NotificationDto> getMyNotifications(Authentication authentication) {
        String email = authentication.getName();
        return notificationService.getNotificationsByEmail(email);
    }

    // ✅ User: Get unread notifications
    @GetMapping("/my/unread")
    @PreAuthorize("hasAnyRole('VOLUNTEER', 'ADMIN')")
    public List<NotificationDto> getMyUnreadNotifications(Authentication authentication) {
        String email = authentication.getName();
        return notificationService.getUnreadNotificationsByEmail(email);
    }

    // ✅ User: Mark notification as read
    @PutMapping("/{notificationId}/read")
    @PreAuthorize("hasAnyRole('VOLUNTEER', 'ADMIN')")
    public NotificationDto markAsRead(@PathVariable Long notificationId) {
        return notificationService.markAsRead(notificationId);
    }

    // ✅ User: Mark all notifications as read
    @PutMapping("/read-all")
    @PreAuthorize("hasAnyRole('VOLUNTEER', 'ADMIN')")
    public java.util.Map<String, String> markAllAsRead(Authentication authentication) {
        String email = authentication.getName();
        notificationService.markAllAsReadByEmail(email);
        return java.util.Map.of("message", "All notifications marked as read");
    }

    // ✅ User: Count unread notifications
    @GetMapping("/my/unread/count")
    @PreAuthorize("hasAnyRole('VOLUNTEER', 'ADMIN')")
    public long countUnreadNotifications(Authentication authentication) {
        String email = authentication.getName();
        return notificationService.countUnreadNotificationsByEmail(email);
    }
}