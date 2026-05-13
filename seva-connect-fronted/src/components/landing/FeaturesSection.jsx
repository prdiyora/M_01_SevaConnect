import React from "react";

const FeaturesSection = () => {
  return (
    <section className="features-section" id="features">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">Features</span>
          <h2 className="section-title">Why Choose SevaConnect?</h2>
          <p className="section-subtitle">
            Powerful features designed to make volunteering simple, accessible,
            and impactful.
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Browse Services</h3>
            <p>
              Explore a wide range of social services and volunteer
              opportunities available near you.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🙋</div>
            <h3>Join as Volunteer</h3>
            <p>
              Sign up instantly and start making a difference. No complicated
              processes — just pure seva.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Location-Based Services</h3>
            <p>
              Find services and events happening in your city or neighborhood.
              Help locally, impact globally.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Contributions</h3>
            <p>
              Monitor your volunteer hours, services joined, and the lives
              you've touched through your dashboard.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
