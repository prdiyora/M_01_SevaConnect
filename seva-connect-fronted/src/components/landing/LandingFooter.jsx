import React from "react";

const LandingFooter = ({ scrollToSection }) => {
  return (
    <footer className="landing-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">🙏</span>
              <span className="logo-text">SevaConnect</span>
            </div>
            <p className="footer-description">
              Connecting volunteers with people in need. Together, we build a
              better society through seva and compassion.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link" aria-label="Facebook">FB</a>
              <a href="#" className="social-link" aria-label="Twitter">TW</a>
              <a href="#" className="social-link" aria-label="Instagram">IG</a>
              <a href="#" className="social-link" aria-label="LinkedIn">IN</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-group">
            <h4>Quick Links</h4>
            <ul>
              <li><a onClick={() => scrollToSection("about")}>About Us</a></li>
              <li><a onClick={() => scrollToSection("services")}>Services</a></li>
              <li><a onClick={() => scrollToSection("features")}>Features</a></li>
              <li><a onClick={() => scrollToSection("how-it-works")}>How It Works</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-links-group">
            <h4>Services</h4>
            <ul>
              <li><a href="#">Blood Donation</a></li>
              <li><a href="#">Teaching</a></li>
              <li><a href="#">Environment</a></li>
              <li><a href="#">Community Help</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-links-group">
            <h4>Contact</h4>
            <ul>
              <li>📧 info@sevaconnect.org</li>
              <li>📞 +91 98765 43210</li>
              <li>📍 Ahmedabad, Gujarat, India</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 SevaConnect. All rights reserved. Made with ❤️ for society.</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
