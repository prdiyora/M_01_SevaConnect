import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getMyProfile, updateMyProfile } from "../../services/volunteerApi.js";
import "./Settings.css";

const Settings = () => {
  const navigate = useNavigate();
  const { setUser: setGlobalUser } = useContext(AuthContext);

  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* ── Fetch fresh profile from backend ── */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyProfile();
        setUser(data);
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
        });

        // keep localStorage and Context in sync
        localStorage.setItem("user", JSON.stringify(data));
        setGlobalUser(data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        // fallback: use localStorage
        const local = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(local);
        setFormData({
          name: local.name || "",
          phone: local.phone || "",
        });
      } finally {
        setFetching(false);
      }
    };

    loadProfile();
  }, [setGlobalUser]);

  /* ── Build formatted Volunteer ID ── */
  const formattedVolunteerId = user?.id ? `VOLUNTEER${user.id}` : "N/A";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess("");
    setError("");
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await updateMyProfile({
        name: formData.name,
        phone: formData.phone,
      });

      // Update local storage, local state, and global context
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setGlobalUser(updatedUser);
      
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setGlobalUser(null);
    navigate("/login");
  };

  /* ── Loading state ── */
  if (fetching) {
    return (
      <div className="settings-loading">
        <div className="settings-spinner" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p>Manage your account preferences and profile</p>
      </div>

      {/* ══════ ALERTS ══════ */}
      {success && (
        <div className="settings-alert settings-alert-success">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="settings-alert settings-alert-error">
          ⚠️ {error}
        </div>
      )}

      {/* ══════ VOLUNTEER ID BADGE ══════ */}
      <div className="settings-id-card">
        <div className="settings-id-left">
          <div className="settings-id-avatar">
            {(user?.name || "V").charAt(0).toUpperCase()}
          </div>
          <div className="settings-id-info">
            <span className="settings-id-name">{user?.name || "Volunteer"}</span>
            <span className="settings-id-email">{user?.email || "—"}</span>
          </div>
        </div>
        <div className="settings-id-right">
          <span className="settings-id-label">Volunteer ID</span>
          <span className="settings-id-value">{formattedVolunteerId}</span>
        </div>
      </div>

      {/* ══════ UPDATE FORM ══════ */}
      <div className="settings-card">
        <div className="settings-card-header">
          <h2>✏️ Edit Profile</h2>
          <p>Update your personal information</p>
        </div>
        <div className="settings-card-body">
          <div className="settings-form-grid">
            <div className="settings-field">
              <label>Full Name</label>
              <div className="settings-input-wrapper">
                <span className="settings-input-icon">👤</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="settings-input"
                />
              </div>
            </div>

            <div className="settings-field">
              <label>Phone Number</label>
              <div className="settings-input-wrapper">
                <span className="settings-input-icon">📞</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10-digit phone number"
                  className="settings-input"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          <div className="settings-actions">
            <button
              className="settings-save-btn"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <><span className="settings-btn-spinner" /> Saving...</>
              ) : (
                "💾 Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ══════ ACCOUNT INFO ══════ */}
      <div className="settings-card">
        <div className="settings-card-header">
          <h2>📧 Account Info</h2>
          <p>Read-only account identifiers</p>
        </div>
        <div className="settings-card-body">
          <div className="settings-readonly">
            <div className="settings-readonly-item">
              <span className="settings-readonly-label">Email Address</span>
              <span className="settings-readonly-value">
                {user?.email || "N/A"}
              </span>
            </div>
            <div className="settings-readonly-item">
              <span className="settings-readonly-label">Account Role</span>
              <span className="settings-readonly-value settings-role-badge">
                {user?.role || "Volunteer"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ LOGOUT ══════ */}
      <div className="settings-logout-wrap">
         <button className="settings-logout-btn" onClick={handleLogout}>
            🚪 Sign Out of Account
          </button>
      </div>
    </div>
  );
};

export default Settings;
