import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEvents, getMyEvents, searchEvents } from "../../services/eventApi.js";
import { getMyRequests } from "../../services/volunteerRequestApi.js";
import { getMyStats } from "../../services/volunteerApi.js";
import { getMyUnreadNotifications, countUnreadNotifications } from "../../services/notificationApi.js";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState({
    availableEvents: 0,
    joinedEvents: 0,
    pendingEvents: 0,
    peopleHelped: 0,
    hoursVolunteered: 0
  });
  const [loading, setLoading] = useState(true);

  // ✅ Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null); // null = not searching

  /* ── On mount: load user + all data ── */
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    fetchData();
  }, []);


  useEffect(() => {
    const t = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);


  useEffect(() => {
    if (!debouncedTerm) {
      setSearchResults(null); // show all events
      return;
    }
    performSearch(debouncedTerm);

  }, [debouncedTerm]);

  const fetchData = async () => {
    try {
      // Run requests in parallel
      const [eventsData, myEventsData, requestsData, statsData, unreadNotifData, countNotifData] = await Promise.allSettled([
        getAllEvents(),
        getMyEvents(),
        getMyRequests(),
        getMyStats(),
        getMyUnreadNotifications(),
        countUnreadNotifications(),
      ]);

      // Process events
      if (eventsData.status === 'fulfilled') {
        setEvents(Array.isArray(eventsData.value) ? eventsData.value : []);
      }

      // Process confirmed events
      if (myEventsData.status === 'fulfilled') {
        setMyEvents(Array.isArray(myEventsData.value) ? myEventsData.value : []);
      }

      // Process pending requests
      if (requestsData.status === 'fulfilled') {
        const reqs = Array.isArray(requestsData.value) ? requestsData.value : [];
        setPendingRequests(reqs.filter(r => r.status === 'PENDING'));
      }

      // Process stats
      if (statsData.status === 'fulfilled') {
        setStats(statsData.value);
      }

      // Process notifications
      if (unreadNotifData.status === 'fulfilled') {
        setRecentNotifications(Array.isArray(unreadNotifData.value) ? unreadNotifData.value.slice(0, 1) : []);
      }
      if (countNotifData.status === 'fulfilled') {
        setUnreadCount(countNotifData.value);
      }
    } catch (err) {
      console.error("Unexpected fetch error:", err);
    } finally {
      setLoading(false);
    }
  };


  const performSearch = async (keyword) => {
    try {
      setSearching(true);
      const data = await searchEvents(keyword);
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedTerm("");
    setSearchResults(null);
  };


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

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

  const isPast = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(dateStr);
    return eventDate < today;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "Blood Donation": "🩸",
      Teaching: "📚",
      Environment: "🌱",
      Health: "🏥",
      "Community Help": "🏘️",
      Cleanliness: "🧹",
    };
    return icons[category] || "📋";
  };

  /* ── Decide which list to render ── */
  const displayedEvents = useMemo(() => {
    return searchResults !== null ? searchResults : events;
  }, [searchResults, events]);

  const isSearchMode = searchResults !== null;

  if (loading) {
    return (
      <div className="home-loading">
        <div className="home-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* ══════ WELCOME BANNER ══════ */}
      <div className="home-welcome">
        <div className="home-welcome-content">
          <div className="home-welcome-text">
            <h1>
              {getGreeting()},{" "}
              <span className="home-highlight">
                {user?.name || "Volunteer"}
              </span>{" "}
              👋
            </h1>
            <p>Ready to make a difference today?</p>
          </div>
        </div>
      </div>

      {/* 🔔 NOTIFICATION ALERT BANNER */}
      {recentNotifications.length > 0 && (
        <div className="home-notif-banner" onClick={() => navigate("/user/notifications")}>
          <div className="home-notif-icon">🔔</div>
          <div className="home-notif-content">
            <span className="home-notif-tag">NEW UPDATE</span>
            <p className="home-notif-text">{recentNotifications[0].message}</p>
          </div>
          <button className="home-notif-view">View Details →</button>
        </div>
      )}

      {/* ══════ STATS ══════ */}
      <div className="home-stats-grid">
        <div className="home-stat-card">
          <div
            className="home-stat-icon"
            style={{ background: "rgba(108,60,224,0.08)", color: "#6c3ce0" }}
          >
            📋
          </div>
          <div className="home-stat-info">
            <span className="home-stat-value">{stats.availableEvents}</span>
            <span className="home-stat-label">Available Events</span>
          </div>
        </div>
        <div className="home-stat-card">
          <div
            className="home-stat-icon"
            style={{ background: "rgba(16,185,129,0.08)", color: "#059669" }}
          >
            🤝
          </div>
          <div className="home-stat-info">
            <span className="home-stat-value">
              {stats.joinedEvents}
              {stats.pendingEvents > 0 && (
                <span className="home-stat-pending" title={`${stats.pendingEvents} pending requests`}>
                  +{stats.pendingEvents}
                </span>
              )}
            </span>
            <span className="home-stat-label">Joined Events</span>
          </div>
        </div>
        <div className="home-stat-card">
          <div
            className="home-stat-icon"
            style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}
          >
            ❤️
          </div>
          <div className="home-stat-info">
            <span className="home-stat-value">
              {stats.peopleHelped}
              {stats.peopleHelped > 0 && "+"}
            </span>
            <span className="home-stat-label">People Helped</span>
          </div>
        </div>
        <div className="home-stat-card">
          <div
            className="home-stat-icon"
            style={{ background: "rgba(59,130,246,0.08)", color: "#2563eb" }}
          >
            ⏱️
          </div>
          <div className="home-stat-info">
            <span className="home-stat-value">
              {stats.hoursVolunteered}
              {stats.hoursVolunteered > 0 && "+"}
            </span>
            <span className="home-stat-label">Hours Volunteered</span>
          </div>
        </div>
      </div>

      {/* ══════ QUICK ACTIONS ══════ */}
      <div className="home-card">
        <div className="home-card-header">
          <h2>⚡ Quick Actions</h2>
        </div>
        <div className="home-card-body">
          <div className="home-actions-grid">
            <button
              className="home-action-btn"
              onClick={() => navigate("/user/my-services")}
            >
              <span className="home-action-icon">📋</span>
              <span>My Services</span>
            </button>
            <button
              className="home-action-btn"
              onClick={() => navigate("/user/profile")}
            >
              <span className="home-action-icon">👤</span>
              <span>Profile</span>
            </button>
            <button
              className="home-action-btn"
              onClick={() => navigate("/user/notifications")}
            >
              <span className="home-action-icon">
                🔔
                {unreadCount > 0 && (
                  <span className="home-action-badge">{unreadCount}</span>
                )}
              </span>
              <span>Notifications</span>
            </button>
            <button
              className="home-action-btn"
              onClick={() => navigate("/user/settings")}
            >
              <span className="home-action-icon">⚙️</span>
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══════ ALL / SEARCH EVENTS ══════ */}
      <div className="home-card">
        <div className="home-card-header">
          <h2>
            {isSearchMode ? "🔎 Search Results" : "🎯 All Available Events"}
          </h2>
          <span className="home-card-count">
            {displayedEvents.length}{" "}
            {displayedEvents.length === 1 ? "event" : "events"}
          </span>
        </div>

        {/* ✅ Search Bar */}
        <div className="home-search-wrap">
          <div className="home-search-box">
            <span className="home-search-icon">🔍</span>
            <input
              type="text"
              className="home-search-input"
              placeholder="Search events by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="home-search-clear"
                onClick={clearSearch}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          {searching && (
            <span className="home-search-status">Searching...</span>
          )}
        </div>

        <div className="home-card-body">
          {displayedEvents.length === 0 ? (
            <div className="home-empty">
              <span>{isSearchMode ? "🔍" : "📭"}</span>
              <p>
                {isSearchMode
                  ? `No events found for "${debouncedTerm}"`
                  : "No events available right now"}
              </p>
            </div>
          ) : (
            <div className="home-events-grid">
              {displayedEvents.map((event) => (
                <div
                  className={`home-event-card ${isPast(event.eventDate) ? 'home-event-past' : ''}`}
                  key={event.id}
                  onClick={() => navigate(`/user/service/${event.id}`)}
                >
                  <div className="home-event-img-wrap">
                    <img
                      src={event.imageUrl || "https://placehold.co/600x400?text=SevaConnect"}
                      alt={event.eventname}
                      className="home-event-img"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/600x400?text=Event+Image";
                      }}
                    />
                    {isPast(event.eventDate) && (
                      <div className="home-event-overlay">
                        <span>COMPLETED</span>
                      </div>
                    )}
                  </div>

                  <div className="home-event-top">
                    <span className="home-event-category">
                      {getCategoryIcon(event.category)}{" "}
                      {event.category || "General"}
                    </span>
                    <span className="home-event-spots">
                      👥 {event.max_volunteers || "∞"}
                    </span>
                  </div>

                  <h3 className="home-event-title">{event.eventname}</h3>

                  <p className="home-event-desc">
                    {event.description
                      ? event.description.length > 90
                        ? event.description.substring(0, 90) + "..."
                        : event.description
                      : "No description available"}
                  </p>

                  <div className="home-event-meta">
                    <span>📍 {event.location || "N/A"}</span>
                    <span className={isPast(event.eventDate) ? 'text-danger' : ''}>
                      📅 {formatDate(event.eventDate)} {isPast(event.eventDate) && '(Completed)'}
                    </span>
                  </div>

                  <div className="home-event-footer">
                    <button className="home-event-btn">
                      {isPast(event.eventDate) ? 'View Recap →' : 'View Details →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
