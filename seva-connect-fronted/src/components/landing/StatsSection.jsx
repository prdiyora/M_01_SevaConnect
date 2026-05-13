import React from "react";

const StatsSection = () => {
  return (
    <section className="stats-section">
      <div className="stats-bg-overlay"></div>
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag section-tag-light">Our Impact</span>
          <h2 className="section-title section-title-light">
            Together, We're Making a Difference
          </h2>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-number">500+</div>
            <div className="stat-label">Volunteers</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-number">120+</div>
            <div className="stat-label">Services</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❤️</div>
            <div className="stat-number">1000+</div>
            <div className="stat-label">People Helped</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏙️</div>
            <div className="stat-number">25+</div>
            <div className="stat-label">Cities</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
