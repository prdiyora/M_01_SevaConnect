import React, { useEffect, useState } from "react";
import { getMyProfile } from "../../services/volunteerApi.js";
import "./Profile.css";

/* ─────────────────────────────────────────────
   Field sub-component
───────────────────────────────────────────── */
const Field = ({ icon, label, value, mono = false }) => (
  <div className="profile-field">
    <div className="profile-field-icon">{icon}</div>
    <div className="profile-field-text">
      <p className="profile-field-label">{label}</p>
      <h4 className={`profile-field-value ${mono ? "profile-field-mono" : ""}`}>
        {value || "Not provided"}
      </h4>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Skeleton placeholder
───────────────────────────────────────────── */
const Skeleton = ({ width = "100%", height = "16px", radius = "6px" }) => (
  <div
    className="skeleton"
    style={{ width, height, borderRadius: radius }}
  />
);

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setUser(data);
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getUserInitial = () =>
    user?.name ? user.name.charAt(0).toUpperCase() : "?";

  /* ✅ Formatted Volunteer ID */
  const volunteerId = user?.id ? `VOLUNTEER${user.id}` : null;

  const handleCopyId = async () => {
    if (!volunteerId) return;
    try {
      await navigator.clipboard.writeText(volunteerId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback silently
    }
  };

  /* ── Error state ── */
  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-error-card">
          <span className="profile-error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* ══════ HEADER CARD ══════ */}
      <div className="profile-header-card">
        <div className="profile-header-bg" />

        <div className="profile-header-content">
          <div className="profile-left">
            {/* Avatar */}
            <div className="profile-avatar">
              {loading ? (
                <Skeleton width="100%" height="100%" radius="50%" />
              ) : (
                getUserInitial()
              )}
            </div>

            {/* Info */}
            <div className="profile-header-info">
              {loading ? (
                <>
                  <Skeleton width="180px" height="22px" radius="8px" />
                  <Skeleton width="220px" height="14px" radius="6px" />
                </>
              ) : (
                <>
                  <h1>{user?.name || "Volunteer"}</h1>
                  <p className="profile-email">{user?.email || ""}</p>
                </>
              )}

              <div className="profile-badges">
                <span className="profile-badge badge-primary">
                  🙋 Volunteer
                </span>
                {!loading && user?.phone && (
                  <span className="profile-badge badge-secondary">
                    📞 {user.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ✅ ID badge — top right */}
          {!loading && volunteerId && (
            <div className="profile-id-badge" onClick={handleCopyId} title="Click to copy">
              <div className="profile-id-badge-inner">
                <span className="profile-id-badge-label">Volunteer ID</span>
                <span className="profile-id-badge-value">{volunteerId}</span>
              </div>
              <span className="profile-id-copy">
                {copied ? "✓ Copied" : "📋"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ══════ DETAILS CARD ══════ */}
      <div className="profile-details-card">
        <div className="profile-details-header">
          <h2>👤 Personal Information</h2>
          <p>Your registered account details</p>
        </div>

        <div className="profile-details-body">
          {loading ? (
            <div className="profile-fields-grid">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="profile-field">
                  <Skeleton width="42px" height="42px" radius="10px" />
                  <div className="profile-field-text" style={{ flex: 1 }}>
                    <Skeleton width="80px" height="11px" radius="4px" />
                    <Skeleton width="140px" height="16px" radius="6px" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="profile-fields-grid">
              <Field
                icon="🆔"
                label="Volunteer ID"
                value={volunteerId}
                mono
              />
              <Field icon="👤" label="Full Name" value={user?.name} />
              <Field icon="📧" label="Email Address" value={user?.email} />
              <Field icon="📞" label="Mobile Number" value={user?.phone} />
              <Field icon="🏷️" label="Role" value="Volunteer" />
              <Field icon="✅" label="Status" value="Active" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
