// Centralized auth API - reuse BASE_URL and getHeaders from apiConfig
import { BASE_URL, getHeaders } from './apiConfig.js';

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
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Registration failed");
  }
  return res.text();
};
