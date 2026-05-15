import { BASE_URL, getHeaders } from './apiConfig';

/**
 * Helper to handle fetch responses and throw detailed errors
 */
const handleResponse = async (res, actionName) => {
  if (!res.ok) {
    let errorMessage = `${actionName} failed`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      // If not JSON, try text
      const text = await res.text().catch(() => "");
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }
  
  // Handle empty responses or plain text
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
};

// ─── AUTH ────────────────────────────────────────────────

export const loginApi = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: getHeaders(false),
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res, "Login");
};

export const registerApi = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: getHeaders(false),
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Registration");
};

// ─── ADMIN DASHBOARD ────────────────────────────────────

export const fetchDashboardStats = async () => {
  const res = await fetch(`${BASE_URL}/admin/stats/dashboard`, {
    headers: getHeaders(true),
    cache: 'no-store',
  });
  return handleResponse(res, "Loading dashboard stats");
};

// ─── ADMIN REPORTS ───────────────────────────────────────

export const fetchReports = async () => {
  const res = await fetch(`${BASE_URL}/admin/reports`, {
    headers: getHeaders(true),
    cache: 'no-store',
  });
  return handleResponse(res, "Loading reports");
};

export const fetchEventsByCategoryReport = async () => {
  const res = await fetch(`${BASE_URL}/admin/reports/events-by-category`, {
    headers: getHeaders(true),
    cache: 'no-store',
  });
  return handleResponse(res, "Loading category data");
};

export const fetchMonthlyGrowthReport = async () => {
  const res = await fetch(`${BASE_URL}/admin/reports/monthly-growth`, {
    headers: getHeaders(true),
    cache: 'no-store',
  });
  return handleResponse(res, "Loading growth data");
};

// ─── VOLUNTEERS ──────────────────────────────────────────

export const fetchVolunteers = async () => {
  const res = await fetch(`${BASE_URL}/volunteers`, {
    headers: getHeaders(true),
    cache: 'no-store',
  });
  return handleResponse(res, "Loading volunteers");
};

export const createVolunteer = async (data) => {
  const res = await fetch(`${BASE_URL}/volunteers`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  return handleResponse(res, "Creation");
};

export const updateVolunteer = async (id, data) => {
  const res = await fetch(`${BASE_URL}/volunteers/${id}`, {
    method: "PATCH",
    headers: getHeaders(true),
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  return handleResponse(res, "Update");
};

export const deleteVolunteer = async (id) => {
  const res = await fetch(`${BASE_URL}/volunteers/${id}`, {
    method: "DELETE",
    headers: getHeaders(true),
    cache: 'no-store',
  });
  return handleResponse(res, "Delete");
};

// ─── EVENTS ──────────────────────────────────────────────

export const fetchEvents = async () => {
  const res = await fetch(`${BASE_URL}/events/admin`, {
    headers: getHeaders(true),
    cache: 'no-store',
  });
  // Simplified: No more fallback to /events. If /events/admin fails, we show the error.
  return handleResponse(res, "Loading events");
};

export const fetchEventById = async (id) => {
  const res = await fetch(`${BASE_URL}/events/${id}`, {
    headers: getHeaders(false),
    cache: 'no-store',
  });
  return handleResponse(res, "Loading event");
};

export const createEvent = async (data) => {
  const res = await fetch(`${BASE_URL}/events`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  return handleResponse(res, "Create");
};

export const updateEvent = async (id, data) => {
  const res = await fetch(`${BASE_URL}/events/${id}`, {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  return handleResponse(res, "Update");
};

export const deleteEvent = async (id) => {
  const res = await fetch(`${BASE_URL}/events/${id}`, {
    method: "DELETE",
    headers: getHeaders(true),
    cache: 'no-store',
  });
  return handleResponse(res, "Delete");
};

export const searchEvents = async (keyword) => {
  const res = await fetch(
    `${BASE_URL}/events/search?keyword=${encodeURIComponent(keyword)}`,
    {
      headers: getHeaders(false),
      cache: 'no-store',
    }
  );
  return handleResponse(res, "Search");
};

export const fetchEventsByCategory = async (category) => {
  const res = await fetch(`${BASE_URL}/events/category/${category}`, {
    headers: getHeaders(false),
    cache: 'no-store',
  });
  return handleResponse(res, "Filter");
};

// ─── VOLUNTEER-EVENTS ────────────────────────────────────

export const fetchVolunteersByEvent = async (eventId) => {
  const res = await fetch(`${BASE_URL}/volunteer-events/event/${eventId}`, {
    headers: getHeaders(true),
    cache: 'no-store',
  });
  return handleResponse(res, "Loading registrations");
};

export const getMyEvents = async () => {
  const res = await fetch(`${BASE_URL}/volunteer-events/my`, {
    headers: getHeaders(true),
    cache: 'no-store',
  });
  return handleResponse(res, "Loading my events");
};

export const joinEvent = async (eventId) => {
  const res = await fetch(`${BASE_URL}/volunteer-events/join/${eventId}`, {
    method: "POST",
    headers: getHeaders(true),
    cache: 'no-store',
  });
  return handleResponse(res, "Joining event");
};

export const checkIsJoined = async (eventId) => {
  const res = await fetch(`${BASE_URL}/volunteer-events/check/${eventId}`, {
    headers: getHeaders(true),
    cache: 'no-store',
  });
  return handleResponse(res, "Checking join status");
};

export const cancelRegistration = async (regId) => {
  const res = await fetch(`${BASE_URL}/volunteer-events/cancel/${regId}`, {
    method: "DELETE",
    headers: getHeaders(true),
    cache: 'no-store',
  });
  return handleResponse(res, "Cancelling registration");
};
