import { BASE_URL, getHeaders } from './apiConfig';

// ─── AUTH ────────────────────────────────────────────────

export const loginApi = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: getHeaders(false),
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Invalid email or password");
  return res.json(); // { token, email, role }
};

export const registerApi = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: getHeaders(false),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.text();
};

// ─── ADMIN DASHBOARD ────────────────────────────────────

export const fetchDashboardStats = async () => {
  const res = await fetch(`${BASE_URL}/admin/stats/dashboard`, {
    headers: getHeaders(true),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Failed to load dashboard stats");
  return res.json(); // { totalVolunteers, totalEvents, pendingRequests, approvedRequests, totalImpact, recentRequests }
};

// ─── ADMIN REPORTS ───────────────────────────────────────

export const fetchReports = async () => {
  const res = await fetch(`${BASE_URL}/admin/reports`, {
    headers: getHeaders(true),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Failed to load reports");
  return res.json();
};

export const fetchEventsByCategoryReport = async () => {
  const res = await fetch(`${BASE_URL}/admin/reports/events-by-category`, {
    headers: getHeaders(true),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Failed to load category data");
  return res.json();
};

export const fetchMonthlyGrowthReport = async () => {
  const res = await fetch(`${BASE_URL}/admin/reports/monthly-growth`, {
    headers: getHeaders(true),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Failed to load growth data");
  return res.json();
};

// ─── VOLUNTEERS ──────────────────────────────────────────

export const fetchVolunteers = async () => {
  const res = await fetch(`${BASE_URL}/volunteers`, {
    headers: getHeaders(true),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Failed to load volunteers");
  return res.json();
};

export const createVolunteer = async (data) => {
  const res = await fetch(`${BASE_URL}/volunteers`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Creation failed");
  return res.text();
};

export const updateVolunteer = async (id, data) => {
  const res = await fetch(`${BASE_URL}/volunteers/${id}`, {
    method: "PATCH",
    headers: getHeaders(true),
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Update failed");
  return res.json();
};

export const deleteVolunteer = async (id) => {
  const res = await fetch(`${BASE_URL}/volunteers/${id}`, {
    method: "DELETE",
    headers: getHeaders(true),
    cache: 'no-store',
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || "Delete failed");
  }
  
  // Handle both JSON and text responses
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

// ─── EVENTS ──────────────────────────────────────────────

export const fetchEvents = async () => {
  const res = await fetch(`${BASE_URL}/events`, {
    headers: getHeaders(false),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Failed to load events");
  return res.json();
};

export const fetchEventById = async (id) => {
  const res = await fetch(`${BASE_URL}/events/${id}`, {
    headers: getHeaders(false),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Failed to load event");
  return res.json();
};

export const createEvent = async (data) => {
  const res = await fetch(`${BASE_URL}/events`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Create failed");
  return res.json();
};

export const updateEvent = async (id, data) => {
  const res = await fetch(`${BASE_URL}/events/${id}`, {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Update failed");
  return res.json();
};

export const deleteEvent = async (id) => {
  const res = await fetch(`${BASE_URL}/events/${id}`, {
    method: "DELETE",
    headers: getHeaders(true),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Delete failed");
  return res.text(); // Backend returns plain string, not JSON
};

export const searchEvents = async (keyword) => {
  const res = await fetch(
    `${BASE_URL}/events/search?keyword=${encodeURIComponent(keyword)}`,
    {
      headers: getHeaders(false),
      cache: 'no-store',
    }
  );
  if (!res.ok) throw new Error("Search failed");
  return res.json();
};

export const fetchEventsByCategory = async (category) => {
  const res = await fetch(`${BASE_URL}/events/category/${category}`, {
    headers: getHeaders(false),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Filter failed");
  return res.json();
};

// ─── VOLUNTEER-EVENTS ────────────────────────────────────

export const fetchVolunteersByEvent = async (eventId) => {
  const res = await fetch(`${BASE_URL}/volunteer-events/event/${eventId}`, {
    headers: getHeaders(true),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Failed to load registrations");
  return res.json();
};

export const getMyEvents = async () => {
  const res = await fetch(`${BASE_URL}/volunteer-events/my`, {
    headers: getHeaders(true),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Failed to load my events");
  return res.json();
};

export const joinEvent = async (eventId) => {
  const res = await fetch(`${BASE_URL}/volunteer-events/join/${eventId}`, {
    method: "POST",
    headers: getHeaders(true),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Failed to join event");
  return res.json();
};

export const checkIsJoined = async (eventId) => {
  const res = await fetch(`${BASE_URL}/volunteer-events/check/${eventId}`, {
    headers: getHeaders(true),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Failed to check join status");
  return res.json();
};

export const cancelRegistration = async (regId) => {
  const res = await fetch(`${BASE_URL}/volunteer-events/cancel/${regId}`, {
    method: "DELETE",
    headers: getHeaders(true),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Cancel registration failed");
  return res.text();
};
