import React from "react";

const AboutSection = () => {
  return (
    <section className="about-section" id="about">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">About Us</span>
          <h2 className="section-title">What is SevaConnect?</h2>
          <p className="section-subtitle">
            A community-driven platform bridging the gap between willing hearts and those in need.
          </p>
        </div>
        <div className="about-cards">
          <div className="about-card">
            <div className="about-card-icon">🤝</div>
            <h3>Connect with NGOs</h3>
            <p>Collaborate with verified local organizations to amplify your reach and impact.</p>
          </div>
          <div className="about-card">
            <div className="about-card-icon">❤️</div>
            <h3>Direct Seva</h3>
            <p>From teaching to blood donation — choose your way to make a difference.</p>
          </div>
          <div className="about-card">
            <div className="about-card-icon">🌍</div>
            <h3>Real Impact</h3>
            <p>Every small action creates a ripple. Monitor your contributions in real-time.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
