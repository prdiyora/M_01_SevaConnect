import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = ({ scrollToSection }) => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-badge">🌟 #1 Volunteer Platform</span>
          <h1 className="hero-title">
            Connect. Serve.
            <br />
            <span className="hero-highlight">Make Impact.</span>
          </h1>
          <p className="hero-subtitle">
            Join thousands of volunteers and help society with meaningful
            services. Together, we can create a better tomorrow.
          </p>
          <div className="hero-buttons">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate("/register")}
            >
              🚀 Join Now
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => scrollToSection("services")}
            >
              🔍 Explore Services
            </button>
          </div>
          <div className="hero-stats-mini">
            <div className="hero-stat-mini">
              <div className="hero-avatars">
                <span className="mini-avatar" style={{ background: "#ff6b6b" }}>P</span>
                <span className="mini-avatar" style={{ background: "#4ecdc4" }}>R</span>
                <span className="mini-avatar" style={{ background: "#45b7d1" }}>A</span>
                <span className="mini-avatar" style={{ background: "#f9ca24" }}>S</span>
              </div>
              <span>500+ volunteers already joined</span>
            </div>
          </div>
        </div>

        <div className="hero-illustration">
          <div className="hero-card hero-card-1">
            <span className="hero-card-icon">🤝</span>
            <span>Volunteer Connected!</span>
          </div>
          <div className="hero-card hero-card-2">
            <span className="hero-card-icon">❤️</span>
            <span>12 People Helped Today</span>
          </div>
          <div className="hero-card hero-card-3">
            <span className="hero-card-icon">🌍</span>
            <span>Impact Growing...</span>
          </div>
          <div className="hero-main-visual">
            <div className="visual-circle"></div>
            <div className="visual-person">🧑‍🤝‍🧑</div>
            <div className="visual-heart">💖</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
