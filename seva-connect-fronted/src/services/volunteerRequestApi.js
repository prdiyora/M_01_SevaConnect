import { BASE_URL } from './apiConfig';

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

// User: Request to join an event
export const requestJoinEvent = async (eventId) => {
    const res = await fetch(`${BASE_URL}/volunteer-requests/join/${eventId}`, {
        method: "POST",
        headers: getHeaders(),
        cache: 'no-store',
    });
    if (!res.ok) throw new Error("Failed to submit request");
    return res.json();
};

// User: Get my requests
export const getMyRequests = async () => {
    const res = await fetch(`${BASE_URL}/volunteer-requests/my`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load my requests");
    return res.json();
};

// Admin: Get all requests
export const getAllRequests = async () => {
    const res = await fetch(`${BASE_URL}/volunteer-requests`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load requests");
    return res.json();
};

// Admin: Get requests by status
export const getRequestsByStatus = async (status) => {
    const res = await fetch(`${BASE_URL}/volunteer-requests/status/${status}`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load requests by status");
    return res.json();
};

// Admin: Get requests by event
export const getRequestsByEvent = async (eventId) => {
    const res = await fetch(`${BASE_URL}/volunteer-requests/event/${eventId}`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load requests for event");
    return res.json();
};

// Admin: Approve request
export const approveRequest = async (requestId) => {
    const res = await fetch(`${BASE_URL}/volunteer-requests/${requestId}/approve`, {
        method: "PUT",
        headers: getHeaders(),
        cache: 'no-store',
    });
    if (!res.ok) throw new Error("Failed to approve request");
    return res.json();
};

// Admin: Reject request
export const rejectRequest = async (requestId) => {
    const res = await fetch(`${BASE_URL}/volunteer-requests/${requestId}/reject`, {
        method: "PUT",
        headers: getHeaders(),
        cache: 'no-store',
    });
    if (!res.ok) throw new Error("Failed to reject request");
    return res.json();
};

// Admin: Get request by ID
export const getRequestById = async (requestId) => {
    const res = await fetch(`${BASE_URL}/volunteer-requests/${requestId}`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load request");
    return res.json();
};