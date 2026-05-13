// Notification API for user
const BASE_URL = "http://localhost:9090";

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

// User: Get my notifications
export const getMyNotifications = async () => {
    const res = await fetch(`${BASE_URL}/notifications/my`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load notifications");
    return res.json();
};

// User: Get unread notifications
export const getMyUnreadNotifications = async () => {
    const res = await fetch(`${BASE_URL}/notifications/my/unread`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load unread notifications");
    return res.json();
};

// User: Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
    const res = await fetch(`${BASE_URL}/notifications/${notificationId}/read`, {
        method: "PUT",
        headers: getHeaders(),
        cache: 'no-store',
    });
    if (!res.ok) throw new Error("Failed to mark as read");
    return res.json();
};

// User: Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
    const res = await fetch(`${BASE_URL}/notifications/read-all`, {
        method: "PUT",
        headers: getHeaders(),
        cache: 'no-store',
    });
    if (!res.ok) throw new Error("Failed to mark all as read");
    return res.json();
};

// User: Count unread notifications
export const countUnreadNotifications = async () => {
    const res = await fetch(`${BASE_URL}/notifications/my/unread/count`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to count unread notifications");
    return res.json();
};