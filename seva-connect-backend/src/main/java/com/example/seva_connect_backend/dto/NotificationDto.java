package com.example.seva_connect_backend.dto;

import com.example.seva_connect_backend.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDto {

    private Long id;

    private Long userId;
    private String userName;
    private String userEmail;

    private String message;
    private NotificationType type;
    private Boolean isRead;
    private String actionUrl;

    private LocalDateTime createdAt;
}