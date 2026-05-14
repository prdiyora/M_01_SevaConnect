import { BASE_URL } from './apiConfig';

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Get current user's profile (for VOLUNTEER or ADMIN)
export const getMyProfile = async () => {
  const res = await fetch(`${BASE_URL}/volunteers/me`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};

// Get current volunteer stats
export const getMyStats = async () => {
  const res = await fetch(`${BASE_URL}/volunteers/my/stats`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
};

// Get all volunteers (ADMIN only)
export const getAllVolunteers = async () => {
  const res = await fetch(`${BASE_URL}/volunteers`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch volunteers");
  return res.json();
};

// Get volunteer by ID (ADMIN only)
export const getVolunteerById = async (id) => {
  const res = await fetch(`${BASE_URL}/volunteers/${id}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch volunteer");
  return res.json();
};

// Update volunteer
export const updateVolunteer = async (id, data) => {
  const res = await fetch(`${BASE_URL}/volunteers/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update volunteer");
  return res.json();
};

// Mini update volunteer 
export const miniUpdateVolunteer = async (id, data) => {
  const res = await fetch(`${BASE_URL}/volunteers/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update volunteer");
  return res.json();
};

// Update current user's profile
export const updateMyProfile = async (data) => {
  const res = await fetch(`${BASE_URL}/volunteers/me`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
};

// Delete volunteer (ADMIN only)
export const deleteVolunteer = async (id) => {
  const res = await fetch(`${BASE_URL}/volunteers/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete volunteer");
  return res.json();
};