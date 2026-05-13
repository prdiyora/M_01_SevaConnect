// Centralized API configuration for Seva Connect
// Provides separate instances for authenticated and public endpoints

const BASE_URL = "http://localhost:9090";

/**
 * Creates a fetch configuration with optional authentication token
 * @param {boolean} includeAuth - Whether to include Authorization header
 * @returns {Object} Headers object
 */
export const getHeaders = (includeAuth = true) => {
    const headers = {
        "Content-Type": "application/json",
    };

    if (includeAuth) {
        const token = localStorage.getItem("token");
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }

    return headers;
};

/**
 * Public API instance (no authentication required)
 * Use for endpoints that are accessible without login
 */
export const publicApi = {
    get: async (endpoint) => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            headers: getHeaders(false),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
    },

    post: async (endpoint, data) => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            headers: getHeaders(false),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
    },
};

/**
 * Authenticated API instance (requires token)
 * Use for endpoints that need user authentication
 */
export const authApi = {
    get: async (endpoint) => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            headers: getHeaders(true),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
    },

    post: async (endpoint, data) => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
    },

    put: async (endpoint, data) => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: "PUT",
            headers: getHeaders(true),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
    },

    delete: async (endpoint) => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: "DELETE",
            headers: getHeaders(true),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        // Handle both JSON and text responses
        const text = await res.text();
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    },
};

// Export BASE_URL for direct use if needed
export { BASE_URL };