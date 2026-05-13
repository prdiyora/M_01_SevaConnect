import React from "react";

const AboutSection = () => {
  return (
    <section className="about-section" id="about">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">About Us</span>
          <h2 className="section-title">What is SevaConnect?</h2>
          <p className="section-subtitle">
            SevaConnect is a platform where users can find and join social
            services like blood donation, teaching, environment help, and
            more. We bridge the gap between willing hearts and those in need.
          </p>
        </div>
        <div className="about-cards">
          <div className="about-card">
            <div className="about-card-icon">🤝</div>
            <h3>Connect with NGOs</h3>
            <p>
              Find verified NGOs and social organizations working near you.
              Collaborate and amplify your impact.
            </p>
          </div>
          <div className="about-card">
            <div className="about-card-icon">❤️</div>
            <h3>Help People</h3>
            <p>
              From blood donation to teaching underprivileged kids — choose
              how you want to make a difference.
            </p>
          </div>
          <div className="about-card">
            <div className="about-card-icon">🌍</div>
            <h3>Make Impact</h3>
            <p>
              Every small action creates a ripple effect. Track your
              contributions and see the real difference you make.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
