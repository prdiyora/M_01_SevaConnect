import React from "react";

const FeaturesSection = () => {
  return (
    <section className="features-section" id="features">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">Features</span>
          <h2 className="section-title">Why Choose SevaConnect?</h2>
          <p className="section-subtitle">
            Simpler volunteering. Powerful tools for social impact.
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Browse Seva</h3>
            <p>Explore diverse volunteer opportunities available near you.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🙋</div>
            <h3>Instant Join</h3>
            <p>Sign up and start helping in seconds. No complicated processes.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Local Focus</h3>
            <p>Find impact events happening right in your neighborhood.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Live Tracking</h3>
            <p>Monitor your progress and lives touched via your dashboard.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
