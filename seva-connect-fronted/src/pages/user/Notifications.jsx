import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  countUnreadNotifications,
} from "../../services/notificationApi.js";
import "./Notifications.css";

// Helper to format date in a clean, consistent "Classic" way
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return "";
  
  const options = { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  };
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  const datePart = date.toLocaleDateString('en-GB', options); // 16 May 2026
  const timePart = date.toLocaleTimeString('en-US', timeOptions); // 12:33 PM
  
  return `${datePart} • ${timePart}`;
};

// Map notification type to icon and color
const getTypeInfo = (type) => {
  switch (type) {
    case "REQUEST_APPROVED":
      return { icon: "✅", label: "Request Approved", color: "#10b981" };
    case "REQUEST_REJECTED":
      return { icon: "❌", label: "Request Rejected", color: "#ef4444" };
    case "SYSTEM":
      return { icon: "🔔", label: "System", color: "#8b5cf6" };
    case "INFO":
    default:
      return { icon: "ℹ️", label: "Information", color: "#3b82f6" };
  }
};

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [markingAll, setMarkingAll] = useState(false);

  // Fetch notifications and unread count
  const fetchData = async () => {
    try {
      setLoading(true);
      const [notifs, count] = await Promise.all([
        getMyNotifications(),
        countUnreadNotifications(),
      ]);
      setNotifications(notifs);
      setUnreadCount(count);
      setError(null);
    } catch (err) {
      setError("Failed to load notifications. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);
      await markAllNotificationsAsRead();
      // Update all notifications to read
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  return (
    <div className="ncs-root">
      {/* Header */}
      <div className="ncs-page-header">
        <h1 className="ncs-page-title">🔔 Notifications</h1>
        <p className="ncs-page-subtitle">
          Stay updated with latest activities
          {unreadCount > 0 && (
            <span className="ncs-unread-badge">
              {unreadCount} unread
            </span>
          )}
        </p>
        <div className="ncs-header-actions">
          <button
            className="ncs-btn ncs-btn-outline"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0 || markingAll}
          >
            {markingAll ? "Marking..." : "✓ Mark all as read"}
          </button>
          <button
            className="ncs-btn ncs-btn-outline"
            onClick={() => navigate("/user/home")}
          >
            🏠 Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="ncs-card">
        <div className="ncs-card-decor" />
        <div className="ncs-card-inner">
          {loading ? (
            <div className="ncs-loading">
              <div className="ncs-spinner"></div>
              <p>Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="ncs-error">
              <span className="ncs-error-icon">⚠️</span>
              <h3>Unable to load notifications</h3>
              <p>{error}</p>
              <button
                className="ncs-btn ncs-btn-primary"
                onClick={fetchData}
              >
                Retry
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="ncs-empty">
              <span className="ncs-empty-icon">📭</span>
              <h3>No notifications yet</h3>
              <p>
                When you have new updates about events, requests, or
                announcements, they'll appear here.
              </p>
              <button
                className="ncs-btn ncs-btn-outline"
                onClick={() => navigate("/user/my-services")}
              >
                Explore Services
              </button>
            </div>
          ) : (
            <>
              {/* Unread section */}
              {unreadNotifications.length > 0 && (
                <div className="ncs-section">
                  <h3 className="ncs-section-title">
                    Unread ({unreadNotifications.length})
                  </h3>
                  <div className="ncs-list">
                    {unreadNotifications.map((notif) => {
                      const typeInfo = getTypeInfo(notif.type);
                      return (
                        <div
                          key={notif.id}
                          className="ncs-item ncs-item-unread"
                        >
                          <div className="ncs-item-icon">
                            {typeInfo.icon}
                          </div>
                          <div className="ncs-item-content">
                            <div className="ncs-item-header">
                              <span
                                className="ncs-item-type"
                                style={{ color: typeInfo.color }}
                              >
                                {typeInfo.label}
                              </span>
                              <span className="ncs-item-time">
                                {formatDate(notif.createdAt)}
                              </span>
                            </div>
                            <p className="ncs-item-message">
                              {notif.message}
                            </p>
                            {notif.actionUrl && (
                              <button 
                                className="ncs-item-view-btn"
                                onClick={() => navigate(notif.actionUrl)}
                              >
                                View Details →
                              </button>
                            )}
                          </div>
                          <button
                            className="ncs-item-action"
                            onClick={() => handleMarkAsRead(notif.id)}
                            title="Mark as read"
                          >
                            ✓
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Read section */}
              {readNotifications.length > 0 && (
                <div className="ncs-section">
                  <h3 className="ncs-section-title">
                    Read ({readNotifications.length})
                  </h3>
                  <div className="ncs-list">
                    {readNotifications.map((notif) => {
                      const typeInfo = getTypeInfo(notif.type);
                      return (
                        <div key={notif.id} className="ncs-item">
                          <div className="ncs-item-icon">
                            {typeInfo.icon}
                          </div>
                          <div className="ncs-item-content">
                            <div className="ncs-item-header">
                              <span
                                className="ncs-item-type"
                                style={{ color: typeInfo.color }}
                              >
                                {typeInfo.label}
                              </span>
                              <span className="ncs-item-time">
                                {formatDate(notif.createdAt)}
                              </span>
                            </div>
                            <p className="ncs-item-message">
                              {notif.message}
                            </p>
                            {notif.actionUrl && (
                              <button 
                                className="ncs-item-view-btn"
                                onClick={() => navigate(notif.actionUrl)}
                              >
                                View Details →
                              </button>
                            )}
                          </div>
                          <div className="ncs-item-read">Read</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
