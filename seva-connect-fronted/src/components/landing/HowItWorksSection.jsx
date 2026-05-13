import React from "react";

const HowItWorksSection = () => {
  return (
    <section className="how-section" id="how-it-works">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">Simple Process</span>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Getting started with SevaConnect is easy. Just 3 simple steps!
          </p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-icon">📝</div>
            <h3>Sign Up</h3>
            <p>Create your free account in less than a minute. It's quick and easy.</p>
          </div>
          <div className="step-connector">
            <div className="connector-line"></div>
            <div className="connector-arrow">→</div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-icon">🔍</div>
            <h3>Browse Services</h3>
            <p>Explore available volunteer opportunities filtered by location and category.</p>
          </div>
          <div className="step-connector">
            <div className="connector-line"></div>
            <div className="connector-arrow">→</div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-icon">🤝</div>
            <h3>Join & Help</h3>
            <p>Join a service, show up, make a difference. It's that simple!</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
