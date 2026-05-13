package com.example.seva_connect_backend.service;

import com.example.seva_connect_backend.dto.NotificationDto;
import com.example.seva_connect_backend.entity.NotificationEntity;
import com.example.seva_connect_backend.entity.NotificationType;
import com.example.seva_connect_backend.entity.VolunteerEntity;
import com.example.seva_connect_backend.exception.ResourceNotFoundException;
import com.example.seva_connect_backend.repository.NotificationRepository;
import com.example.seva_connect_backend.repository.VolunteerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final VolunteerRepository volunteerRepository;

    public NotificationService(NotificationRepository notificationRepository,
            VolunteerRepository volunteerRepository) {
        this.notificationRepository = notificationRepository;
        this.volunteerRepository = volunteerRepository;
    }

    private NotificationDto mapToDTO(NotificationEntity notification) {
        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setUserId(notification.getUser().getId());
        dto.setUserName(notification.getUser().getName());
        dto.setUserEmail(notification.getUser().getEmail());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType());
        dto.setIsRead(notification.getIsRead());
        dto.setActionUrl(notification.getActionUrl());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }

    public NotificationDto createNotification(Long userId, String message, NotificationType type) {
        return createNotification(userId, message, type, null);
    }

    public NotificationDto createNotification(Long userId, String message, NotificationType type, String actionUrl) {
        VolunteerEntity user = volunteerRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        NotificationEntity notification = new NotificationEntity();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setType(type);
        notification.setIsRead(false);
        notification.setActionUrl(actionUrl);

        return mapToDTO(notificationRepository.save(notification));
    }

    public NotificationDto createNotificationByEmail(String email, String message, NotificationType type) {
        return createNotificationByEmail(email, message, type, null);
    }

    public NotificationDto createNotificationByEmail(String email, String message, NotificationType type, String actionUrl) {
        VolunteerEntity user = volunteerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return createNotification(user.getId(), message, type, actionUrl);
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getNotificationsByEmail(String email) {
        Long userId = getVolunteerIdByEmail(email);
        return getNotificationsByUser(userId);
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getUnreadNotificationsByUser(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getUnreadNotificationsByEmail(String email) {
        Long userId = getVolunteerIdByEmail(email);
        return getUnreadNotificationsByUser(userId);
    }

    public NotificationDto markAsRead(Long notificationId) {
        NotificationEntity notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));
        notification.setIsRead(true);
        return mapToDTO(notificationRepository.save(notification));
    }

    public void markAllAsRead(Long userId) {
        List<NotificationEntity> unread = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }

    public void markAllAsReadByEmail(String email) {
        Long userId = getVolunteerIdByEmail(email);
        markAllAsRead(userId);
    }

    @Transactional(readOnly = true)
    public long countUnreadNotifications(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional(readOnly = true)
    public long countUnreadNotificationsByEmail(String email) {
        Long userId = getVolunteerIdByEmail(email);
        return countUnreadNotifications(userId);
    }

    // Helper method
    private Long getVolunteerIdByEmail(String email) {
        VolunteerEntity volunteer = volunteerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found with email: " + email));
        return volunteer.getId();
    }
}