import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEvents } from "../../services/eventApi.js";
import "./AvailableServices.css";

function AvailableServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getAllEvents();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return isNaN(d)
      ? "Invalid Date"
      : d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
  };

  // 🔥 Category wise color
  const getCategoryColor = (category) => {
    const colors = {
      Health: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
      Environment: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
      Education: { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
      Community: { bg: "#fdf4ff", text: "#9333ea", border: "#e9d5ff" },
    };
    return colors[category] || { bg: "#f3f4f6", text: "#6b7280", border: "#e5e7eb" };
  };

  // 🔥 Category wise icon
  const getCategoryIcon = (category) => {
    const icons = {
      Health: "🩺",
      Environment: "🌱",
      Education: "📚",
      Community: "🤝",
    };
    return icons[category] || "📋";
  };

  const isPast = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(dateStr);
    return eventDate < today;
  };

  return (
    <section className="av-services-section" id="services">
      <div className="av-services-container">

        {/* ===== HEADER ===== */}
        <div className="av-services-header">
          <span className="av-services-tag">🎯 Opportunities</span>
          <h2 className="av-services-title">Available Services</h2>
          <p className="av-services-subtitle">
            Browse ongoing and upcoming volunteer opportunities near you.
          </p>
        </div>

        {/* ===== CONTENT ===== */}
        {loading ? (
          <div className="av-services-loading">
            <div className="av-loading-spinner"></div>
            <p>Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="av-services-empty">
            <div className="av-empty-icon">📭</div>
            <h3>No Services Available</h3>
            <p>Check back later for new volunteer opportunities.</p>
          </div>
        ) : (
          <div className="av-services-grid">
            {services.map((service, index) => {
              const category = service.category || "General";
              const catColor = getCategoryColor(category);
              const catIcon = getCategoryIcon(category);

              return (
                <div
                  className="av-service-card"
                  key={service.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Top accent bar */}
                  <div className="av-card-accent"></div>

                  {/* Image Section */}
                  <div className="av-card-img-wrap">
                    <img
                      src={service.imageUrl || "https://placehold.co/600x400?text=SevaConnect"}
                      alt={service.eventname}
                      className="av-card-img"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/600x400?text=Service+Image";
                      }}
                    />
                    {isPast(service.event_date) && (
                      <div className="av-card-overlay">
                        <span>COMPLETED</span>
                      </div>
                    )}
                  </div>

                  <div className="av-card-content-padding">
                    {/* Category Badge */}
                    <div className="av-card-top">
                      <span
                        className="av-category-badge"
                        style={{
                          background: catColor.bg,
                          color: catColor.text,
                          border: `1px solid ${catColor.border}`,
                        }}
                      >
                        {catIcon} {category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="av-card-title">{service.eventname}</h3>

                    {/* Details */}
                    <div className="av-card-details">
                      <div className="av-card-detail">
                        <span className="av-detail-icon">📍</span>
                        <span className="av-detail-text">
                          {service.location || "Location TBD"}
                        </span>
                      </div>
                      <div className="av-card-detail">
                        <span className="av-detail-icon">📅</span>
                        <span className={`av-detail-text ${isPast(service.event_date) ? 'av-past-date' : ''}`}>
                          {formatDate(service.event_date)} {isPast(service.event_date) && '(Completed)'}
                        </span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="av-card-divider"></div>

                    {/* Button */}
                    <button
                      className={`av-join-btn ${isPast(service.event_date) ? 'av-btn-completed' : ''}`}
                      onClick={() => {
                        const userStr = localStorage.getItem("user");
                        if (!userStr) {
                          navigate("/register");
                        } else {
                          const user = JSON.parse(userStr);
                          navigate(user.role === 'ADMIN' ? `/admin/services` : `/user/service/${service.id}`);
                        }
                      }}
                    >
                      <span>{isPast(service.event_date) ? 'View Details' : 'Join Now'}</span>
                      <span className="av-btn-arrow">→</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default AvailableServices;
