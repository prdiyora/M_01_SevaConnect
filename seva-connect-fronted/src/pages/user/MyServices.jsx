import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyEvents, cancelRegistration } from "../../services/eventApi.js";
import { getMyRequests } from "../../services/volunteerRequestApi.js";
import "./MyServices.css";

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const getUser = () => JSON.parse(localStorage.getItem("user") || "{}");

const formatDate = (date) => {
  if (!date) return "N/A";
  const d = new Date(date);
  return isNaN(d)
    ? "N/A"
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const isUpcoming = (dateStr) => {
  if (!dateStr) return false;
  return new Date(dateStr) >= new Date();
};

const CATEGORY_ICONS = {
  "Blood Donation": "🩸",
  Teaching: "📚",
  Environment: "🌱",
  Health: "🏥",
  "Community Help": "🏘️",
};

/* ─────────────────────────────────────────
   Confirm Cancel Modal
───────────────────────────────────────── */
const CancelModal = ({ event, onConfirm, onClose, cancelling }) => (
  <div className="ms-modal-overlay" onClick={onClose}>
    <div className="ms-modal" onClick={(e) => e.stopPropagation()}>
      <div className="ms-modal-icon">🤔</div>
      <h3>Cancel Registration?</h3>
      <p>
        Leave <strong>{event?.eventTitle}</strong>? Your spot will be released
        and this will be removed from your services.
      </p>
      <div className="ms-modal-actions">
        <button className="ms-modal-keep" onClick={onClose} disabled={cancelling}>
          Keep It
        </button>
        <button className="ms-modal-confirm" onClick={onConfirm} disabled={cancelling}>
          {cancelling ? "Cancelling..." : "Yes, Cancel"}
        </button>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   Toast
───────────────────────────────────────── */
const Toast = ({ message }) => (
  <div className="ms-toast">{message}</div>
);

/* ─────────────────────────────────────────
   Event Card
───────────────────────────────────────── */
const EventCard = ({ record, onCancelClick }) => {
  const upcoming = isUpcoming(record.eventDate);
  const isPending = record.status === "PENDING";
  const isRejected = record.status === "REJECTED";
  const isConfirmed = !isPending && !isRejected;

  const getStatusLabel = () => {
    if (isPending) return "⏳ Pending Approval";
    if (isRejected) return "❌ Rejected";
    return upcoming ? "🟢 Confirmed" : "✔️ Completed";
  };

  const getPillClass = () => {
    if (isPending) return "pill-pending";
    if (isRejected) return "pill-rejected";
    return upcoming ? "pill-upcoming" : "pill-past";
  };

  return (
    <div className={`ms-card ${isPending ? "ms-card-pending" : upcoming ? "ms-card-upcoming" : "ms-card-past"}`}>
      {/* Image Section */}
      <div className="ms-card-img-wrap">
        <img
          src={record.imageUrl || "https://placehold.co/600x400?text=SevaConnect"}
          alt={record.eventTitle}
          className="ms-card-img"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400?text=Event+Image";
          }}
        />
      </div>

      {/* Status pill */}
      <div className={`ms-status-pill ${getPillClass()}`}>
        {getStatusLabel()}
      </div>

      {/* Header */}
      <div className="ms-card-header">
        <div className="ms-category-badge">
          {CATEGORY_ICONS[record.eventCategory] || "📋"} {record.eventCategory || "General"}
        </div>
        <h3 className="ms-card-title">{record.eventTitle}</h3>
      </div>

      {/* Description */}
      {record.eventDescription && (
        <p className="ms-card-desc">
          {record.eventDescription.length > 120
            ? record.eventDescription.slice(0, 120) + "…"
            : record.eventDescription}
        </p>
      )}

      {/* Thank you message for confirmed/upcoming events */}
      {isConfirmed && upcoming && (
        <div className="ms-confirmed-msg">
          <span className="ms-msg-icon">💖</span>
          <p className="ms-msg-text">
            Thank you for your seva! We are excited to see you at the event.
          </p>
        </div>
      )}

      {/* Meta row */}
      <div className="ms-meta-row">
        <span>📍 {record.eventLocation || "N/A"}</span>
        <span>📅 {formatDate(record.eventDate)}</span>
        <span>🕐 {isConfirmed ? "Joined" : "Requested"} {formatDate(record.joinedAt || record.createdAt)}</span>
      </div>

      {/* Footer */}
      <div className="ms-card-footer">
        {isConfirmed && upcoming && (
          <button
            className="ms-cancel-btn"
            onClick={() => onCancelClick(record)}
          >
            ✕ Cancel Registration
          </button>
        )}
        {isPending && (
          <span className="ms-pending-note">Admin will review your request shortly.</span>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Empty State
───────────────────────────────────────── */
const EmptyState = ({ navigate }) => (
  <div className="ms-empty">
    <div className="ms-empty-icon">🙋</div>
    <h2>No Registrations Yet</h2>
    <p>You haven't joined any events. Start volunteering today!</p>
    <button className="ms-explore-btn" onClick={() => navigate("/user/home")}>
      🔍 Explore Events
    </button>
  </div>
);

/* ─────────────────────────────────────────
   Skeleton Card
───────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="ms-skeleton-card">
    <div className="ms-sk ms-sk-pill" />
    <div className="ms-sk ms-sk-title" />
    <div className="ms-sk ms-sk-desc" />
    <div className="ms-sk ms-sk-meta" />
  </div>
);

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
const MyServices = () => {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "upcoming" | "past" | "pending"
  const [modalItem, setModalItem] = useState(null);  // record to cancel
  const [cancelling, setCancelling] = useState(false);
  const [toast, setToast] = useState("");

  /* ── Load Data ── */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to view your services.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [confirmedEvents, requests] = await Promise.all([
          getMyEvents(),
          getMyRequests()
        ]);

        // Normalize confirmed events
        const confirmedNormalized = confirmedEvents.map(event => ({
          ...event,
          status: "CONFIRMED"
        }));

        // Normalize requests (excluding those that are already confirmed/approved)
        const pendingOrRejected = requests
          .filter(req => req.status === "PENDING" || req.status === "REJECTED")
          .map(req => ({
            id: `req-${req.id}`,
            originalId: req.id,
            eventId: req.eventId,
            eventTitle: req.eventTitle,
            eventDescription: req.eventDescription,
            eventLocation: req.eventLocation,
            eventCategory: req.eventCategory || "General",
            eventDate: req.eventDate,
            imageUrl: req.imageUrl,
            joinedAt: req.createdAt,
            status: req.status
          }));

        setRecords([...confirmedNormalized, ...pendingOrRejected]);
      } catch (err) {
        console.error("Failed to load registrations:", err);
        setError("Failed to load your registrations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ── Cancel a registration ── */
  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelRegistration(modalItem.id);
      setRecords((prev) => prev.filter((r) => r.id !== modalItem.id));
      setToast(`Cancelled registration for "${modalItem.eventTitle}"`);
    } catch (err) {
      console.error("Failed to cancel registration:", err);
      setToast("Failed to cancel. Please try again.");
    } finally {
      setCancelling(false);
      setModalItem(null);
    }
  };

  /* ── Filtered list ── */
  const filtered = records.filter((r) => {
    if (filter === "upcoming") return r.status === "CONFIRMED" && isUpcoming(r.eventDate);
    if (filter === "past") return r.status === "CONFIRMED" && !isUpcoming(r.eventDate);
    if (filter === "pending") return r.status === "PENDING";
    return true;
  });

  const confirmedCount = records.filter(r => r.status === "CONFIRMED").length;
  const upcomingCount = records.filter((r) => r.status === "CONFIRMED" && isUpcoming(r.eventDate)).length;
  const pendingCount = records.filter(r => r.status === "PENDING").length;

  /* ── Error state ── */
  if (!loading && error) {
    return (
      <div className="ms-page">
        <div className="ms-error-state">
          <div className="ms-error-icon">⚠️</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className="ms-explore-btn" onClick={() => navigate("/user/home")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ms-page">
      {/* Toast */}
      {toast && <Toast message={toast} />}

      {/* Cancel Modal */}
      {modalItem && (
        <CancelModal
          event={modalItem}
          onConfirm={handleCancel}
          onClose={() => setModalItem(null)}
          cancelling={cancelling}
        />
      )}

      {/* ── Page Header ── */}
      <div className="ms-header">
        <div>
          <h1>📋 My Services</h1>
          <p>All the events you've registered for</p>
        </div>
        <button className="ms-explore-btn-sm" onClick={() => navigate("/user/home")}>
          + Join More Events
        </button>
      </div>

      {/* ── Stats Bar ── */}
      {!loading && records.length > 0 && (
        <div className="ms-stats-bar">
          <div className="ms-stat">
            <span className="ms-stat-value">{records.length}</span>
            <span className="ms-stat-label">Total</span>
          </div>
          <div className="ms-stat-divider" />
          <div className="ms-stat">
            <span className="ms-stat-value ms-stat-green">{upcomingCount}</span>
            <span className="ms-stat-label">Confirmed</span>
          </div>
          <div className="ms-stat-divider" />
          <div className="ms-stat">
            <span className="ms-stat-value ms-stat-orange">{pendingCount}</span>
            <span className="ms-stat-label">Pending</span>
          </div>
        </div>
      )}

      {/* ── Filter Tabs ── */}
      {!loading && records.length > 0 && (
        <div className="ms-filter-tabs">
          {["all", "upcoming", "pending", "past"].map((tab) => (
            <button
              key={tab}
              className={`ms-tab ${filter === tab ? "ms-tab-active" : ""}`}
              onClick={() => setFilter(tab)}
            >
              {tab === "all" && `All (${records.length})`}
              {tab === "upcoming" && `🟢 Confirmed (${upcomingCount})`}
              {tab === "pending" && `⏳ Pending (${pendingCount})`}
              {tab === "past" && `✔️ Completed`}
            </button>
          ))}
        </div>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div className="ms-grid">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : records.length === 0 ? (
        <EmptyState navigate={navigate} />
      ) : filtered.length === 0 ? (
        <div className="ms-no-filter">
          <p>No {filter} events found.</p>
          <button className="ms-tab ms-tab-active" onClick={() => setFilter("all")}>
            Show All
          </button>
        </div>
      ) : (
        <div className="ms-grid">
          {filtered.map((record) => (
            <EventCard
              key={record.id}
              record={record}
              onCancelClick={setModalItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyServices;