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
              <a href="#" className="social-link" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '20px', height: '20px'}}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '20px', height: '20px'}}><path d="M22 4s-1 1-2 1a4.4 4.4 0 0 0-7 1c-3.2-.2-6.3-1.6-8.3-3.8 0 0-3 3.5 0 9a11.4 11.4 0 0 1-6-2c0 4.2 2 7 6 8a10.6 10.6 0 0 1-7 1c1 3.2 4 5 8 5a11.5 11.4 0 0 0 10-10c0-.2 0-.4 0-.6a7.8 7.8 0 0 0 2-2z"></path></svg>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '20px', height: '20px'}}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '20px', height: '20px'}}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
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
