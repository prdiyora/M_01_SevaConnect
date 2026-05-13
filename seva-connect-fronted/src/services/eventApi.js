// Event API for volunteer-facing features
// Uses centralized configuration for consistency
import { publicApi, authApi } from './apiConfig.js';

// Public events (for volunteers) - no authentication required
export const getAllEvents = async () => {
  try {
    return await publicApi.get('/events');
  } catch (error) {
    throw new Error("Failed to load events: " + error.message);
  }
};

export const getEventById = async (id) => {
  try {
    return await publicApi.get(`/events/${id}`);
  } catch (error) {
    throw new Error("Failed to load event: " + error.message);
  }
};

export const searchEvents = async (keyword) => {
  try {
    return await publicApi.get(`/events/search?keyword=${encodeURIComponent(keyword)}`);
  } catch (error) {
    throw new Error("Search failed: " + error.message);
  }
};

export const getEventsByCategory = async (category) => {
  try {
    return await publicApi.get(`/events/category/${category}`);
  } catch (error) {
    throw new Error("Filter failed: " + error.message);
  }
};

// My joined events - requires authentication
export const getMyEvents = async () => {
  try {
    return await authApi.get('/volunteer-events/my');
  } catch (error) {
    throw new Error("Failed to load my events: " + error.message);
  }
};

export const joinEvent = async (eventId) => {
  try {
    return await authApi.post(`/volunteer-requests/join/${eventId}`, {});
  } catch (error) {
    throw new Error("Failed to submit join request: " + error.message);
  }
};

export const checkIsJoined = async (eventId) => {
  try {
    return await authApi.get(`/volunteer-events/check/${eventId}`);
  } catch (error) {
    throw new Error("Failed to check join status: " + error.message);
  }
};

// Admin Events (CRUD) - Note: These are also available in adminApi.js
export const createEvent = async (data) => {
  try {
    return await authApi.post('/events', data);
  } catch (error) {
    throw new Error("Create failed: " + error.message);
  }
};

export const updateEvent = async (id, data) => {
  try {
    return await authApi.put(`/events/${id}`, data);
  } catch (error) {
    throw new Error("Update failed: " + error.message);
  }
};

export const deleteEvent = async (id) => {
  try {
    return await authApi.delete(`/events/${id}`);
  } catch (error) {
    throw new Error("Delete failed: " + error.message);
  }
};

// Cancel a volunteer registration
export const cancelRegistration = async (regId) => {
  try {
    return await authApi.delete(`/volunteer-events/cancel/${regId}`);
  } catch (error) {
    throw new Error("Cancel registration failed: " + error.message);
  }
};
