import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api.js";
import "./ServiceDetails.css";

/* ────────────────────────────────────────────
   Helpers
──────────────────────────────────────────── */
const formatDate = (date) => {
  if (!date) return "N/A";
  const d = new Date(date);
  return isNaN(d)
    ? "N/A"
    : d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
};

const CATEGORY_ICONS = {
  "Blood Donation": "🩸",
  Teaching: "📚",
  Environment: "🌱",
  Health: "🏥",
  "Community Help": "🏘️",
};

/* ────────────────────────────────────────────
   Toast Notification
──────────────────────────────────────────── */
const Toast = ({ message, type }) => (
  <div className={`sd-toast sd-toast-${type}`}>
    {type === "success" ? "✅" : type === "info" ? "ℹ️" : "⚠️"} {message}
  </div>
);

/* ────────────────────────────────────────────
   Main Component
──────────────────────────────────────────── */
const ServiceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joinedRecord, setJoinedRecord] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  /* ── Toast auto-dismiss ── */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  /* ── On mount / id change: load event + check joined status ── */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setJoinedRecord(null); // reset previous state when id changes
      await Promise.all([fetchEvent(), checkIfJoined()]);
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ── Fetch the event details ── */
  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data);
    } catch (err) {
      console.error("fetchEvent error:", err);
      setError(err.response?.data?.message || "Event not found");
    }
  };

  /* ✅ Check if user has already joined or has a pending request */
  const checkIfJoined = async () => {
    try {
      // Step 1: Check if already joined via volunteer-events
      const checkResponse = await api.get(`/volunteer-events/check/${id}`);

      if (checkResponse.data) {
        // User is already joined, get full record
        const myResponse = await api.get(`/volunteer-events/my`);
        const list = myResponse.data;
        const record = list.find(
          (item) => String(item.eventId) === String(id)
        );
        setJoinedRecord(record || { eventId: Number(id), status: 'JOINED' });
        return;
      }

      // Step 2: Check if user has a pending request
      try {
        const myRequestsResponse = await api.get(`/volunteer-requests/my`);
        const requestList = myRequestsResponse.data;
        const pendingRequest = requestList.find(
          (item) => String(item.eventId) === String(id) && item.status === 'PENDING'
        );
        if (pendingRequest) {
          setJoinedRecord({ ...pendingRequest, status: 'PENDING_REQUEST' });
          return;
        }

        const approvedRequest = requestList.find(
          (item) => String(item.eventId) === String(id) && item.status === 'APPROVED'
        );
        if (approvedRequest) {
          setJoinedRecord({ ...approvedRequest, status: 'APPROVED_REQUEST' });
          return;
        }
      } catch (reqErr) {
        // If request endpoint fails, just ignore - user may not have any requests
        console.log("No requests found or error checking requests:", reqErr);
      }

      setJoinedRecord(null);
    } catch (err) {
      console.error("checkIfJoined failed:", err);
      setJoinedRecord(null);
    }
  };

  /* ── Submit request to join event ── */
  const handleJoin = async () => {
    if (joinedRecord) {
      if (joinedRecord.status === 'JOINED') {
        setToast({
          message: "You've already joined this event!",
          type: "info",
        });
      } else if (joinedRecord.status === 'PENDING_REQUEST') {
        setToast({
          message: "You already have a pending request for this event!",
          type: "info",
        });
      } else if (joinedRecord.status === 'APPROVED_REQUEST') {
        setToast({
          message: "Your request has been approved! You're already registered.",
          type: "info",
        });
      }
      return;
    }

    setJoining(true);
    setError("");

    try {
      const response = await api.post(`/volunteer-requests/join/${id}`);
      setJoinedRecord({ ...response.data, status: 'PENDING_REQUEST' });
      setToast({
        message: "Your request to join has been submitted! You'll be notified when it's approved.",
        type: "success",
      });
    } catch (err) {
      console.error("handleJoin error:", err);
      setError(err.response?.data?.message || "Failed to submit join request");
    } finally {
      setJoining(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="sd-loading">
        <div className="sd-spinner" />
        <p>Loading event details...</p>
      </div>
    );
  }

  /* ── Error (no event) ── */
  if (error && !event) {
    return (
      <div className="sd-error-state">
        <div className="sd-error-icon">😔</div>
        <h2>Event Not Found</h2>
        <p>{error}</p>
        <button
          className="sd-back-btn"
          onClick={() => navigate("/user/home")}
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  const isJoined = !!joinedRecord;

  const isPast = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(dateStr);
    return eventDate < today;
  };

  const eventIsPast = event ? isPast(event.event_date) : false;

  return (
    <div className="sd-page">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <button
        className="sd-back-link"
        onClick={() => navigate("/user/home")}
      >
        ← Back to Events
      </button>

      <div className="sd-grid">
        {/* ─── LEFT ─── */}
        <div className="sd-main">
          {/* Hero Image Section */}
          <div className="sd-hero-card">
            <img
              src={event.imageUrl || "https://placehold.co/1200x600?text=SevaConnect+Event"}
              alt={event.eventname}
              className="sd-hero-img"
              onError={(e) => {
                e.target.src = "https://placehold.co/1200x600?text=Event+Banner";
              }}
            />
            {eventIsPast && (
              <div className="sd-hero-overlay">
                <span>EVENT COMPLETED</span>
              </div>
            )}
          </div>

          <div className="sd-card">
            <div className="sd-event-category">
              {CATEGORY_ICONS[event.category] || "📋"}{" "}
              {event.category || "General"}
            </div>
            <h1 className="sd-event-title">{event.eventname}</h1>
            <div className="sd-event-meta-row">
              <span>📍 {event.location || "N/A"}</span>
              <span className={eventIsPast ? "sd-past-date" : ""}>
                📅 {formatDate(event.event_date)} {eventIsPast && "(Completed)"}
              </span>
              {event.time && <span>⏰ {event.time}</span>}
            </div>
          </div>

          <div className="sd-card">
            <h2>📝 Description</h2>
            <p className="sd-description">
              {event.description ||
                "No description available for this event."}
            </p>
          </div>

          <div className="sd-card">
            <h2>ℹ️ Event Details</h2>
            <div className="sd-info-grid">
              <InfoItem icon="📍" label="Location" value={event.location || "N/A"} />
              <InfoItem icon="📅" label="Date" value={formatDate(event.event_date)} />
              <InfoItem icon="👥" label="Max Volunteers" value={event.max_volunteers || "Unlimited"} />
              <InfoItem icon="🏷️" label="Category" value={event.category || "General"} />
            </div>
          </div>
        </div>

        {/* ─── RIGHT ─── */}
        <div className="sd-sidebar">
          <div className="sd-sidebar-card">
            <h3>🤝 Participation</h3>

            {eventIsPast ? (
              <div className="sd-past-section">
                <div className="sd-past-banner">
                  <span>🏁</span>
                  <div>
                    <h4>Event Completed</h4>
                    <p>This volunteer opportunity has ended.</p>
                  </div>
                </div>
                {isJoined ? (
                   <div className="sd-joined-meta" style={{ marginTop: "15px" }}>
                    <p>✅ You participated in this event.</p>
                   </div>
                ) : (
                  <p className="sd-join-hint" style={{ marginTop: "12px" }}>
                    Registration is now closed for this past event.
                  </p>
                )}
                <button className="sd-join-btn sd-btn-completed" disabled>
                  Event Finished
                </button>
              </div>
            ) : isJoined ? (
              <div className="sd-joined-section">
                <div className="sd-joined-msg">
                  <span>{joinedRecord.status === 'PENDING_REQUEST' ? '⏳' : '✅'}</span>
                  <div>
                    <h4>
                      {joinedRecord.status === 'PENDING_REQUEST' 
                        ? 'Request Pending Approval' 
                        : "You're Already Registered!"}
                    </h4>
                    {joinedRecord.joinedAt && (
                      <p>Joined {formatDate(joinedRecord.joinedAt)}</p>
                    )}
                  </div>
                </div>

                <div className="sd-joined-meta">
                  <span>
                    📋 {joinedRecord.eventTitle || event.eventname}
                  </span>
                  <span>
                    📍 {joinedRecord.eventLocation || event.location}
                  </span>
                </div>

                <p className="sd-join-hint" style={{ marginTop: "12px" }}>
                  {joinedRecord.status === 'PENDING_REQUEST'
                    ? "Your request is being reviewed by the team."
                    : "To cancel your registration, please visit My Services."}
                </p>

                <button className="sd-join-btn" disabled>
                  {joinedRecord.status === 'PENDING_REQUEST' ? '⏳ Pending...' : '✅ Already Joined'}
                </button>
              </div>
            ) : (
              <div className="sd-join-section">
                <p className="sd-join-hint">
                  Join this event and make a difference in your community.
                </p>
                <button
                  className="sd-join-btn"
                  onClick={handleJoin}
                  disabled={joining}
                >
                  {joining ? (
                    <>
                      <span className="sd-btn-spinner" /> Joining...
                    </>
                  ) : (
                    "🤝 Join This Event"
                  )}
                </button>
              </div>
            )}

            {error && <div className="sd-error-msg">⚠️ {error}</div>}
          </div>

          <button
            className="sd-my-services-link"
            onClick={() => navigate("/user/my-services")}
          >
            📋 View My Registrations →
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="sd-info-item">
    <span className="sd-info-icon">{icon}</span>
    <div>
      <span className="sd-info-label">{label}</span>
      <span className="sd-info-value">{value}</span>
    </div>
  </div>
);

export default ServiceDetails;
