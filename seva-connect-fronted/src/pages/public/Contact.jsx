import React from "react";
import { useNavigate } from "react-router-dom";
import "./Contact.css";

const Contact = () => {
  const navigate = useNavigate();

  const contactInfo = [
    {
      icon: "📧",
      title: "Email Support",
      detail: "info@sevaconnect.org",
      subtitle: "24/7 Response Desk",
    },
    {
      icon: "📞",
      title: "Hotline",
      detail: "+91 98765 43210",
      subtitle: "Mon-Sat, 9AM-6PM",
    },
    {
      icon: "📍",
      title: "Headquarters",
      detail: "Ahmedabad, Gujarat",
      subtitle: "Pin — 380015",
    },
    {
      icon: "⏰",
      title: "Operational Hours",
      detail: "Mon - Sat",
      subtitle: "09:00 - 18:00 IST",
    },
  ];

  const faqs = [
    {
      question: "How do I become a volunteer?",
      answer:
        "Simply create a free account, browse available services, and click 'Join' on any service you'd like to participate in.",
    },
    {
      question: "Is SevaConnect free to use?",
      answer:
        "Yes! SevaConnect is completely free for all volunteers. We believe in making volunteering accessible to everyone.",
    },
    {
      question: "Can NGOs register on SevaConnect?",
      answer:
        "Absolutely! NGOs can register and post their volunteer requirements. Contact us via email for NGO onboarding.",
    },
    {
      question: "How do I track my volunteer hours?",
      answer:
        "Once you join a service and participate, your hours are automatically tracked in your profile dashboard.",
    },
  ];

  return (
    <div className="contact-page">
      {/* ══════ NAVBAR ══════ */}
      <nav className="ct-navbar">
        <div className="ct-navbar-container">
          <div className="ct-navbar-logo" onClick={() => navigate("/")}>
            <span className="ct-logo-icon">🙏</span>
            <span className="ct-logo-text">SevaConnect</span>
          </div>
          <div className="ct-navbar-links">
            <a href="#" className="ct-nav-link" onClick={(e) => { e.preventDefault(); navigate("/"); }}>Home</a>
            <a href="#" className="ct-nav-link" onClick={(e) => { e.preventDefault(); navigate("/public/services"); }}>Services</a>
          </div>
          <div className="ct-navbar-actions">
            <button className="ct-nav-btn ct-nav-btn-outline" onClick={() => navigate("/login")}>Login</button>
            <button className="ct-nav-btn ct-nav-btn-primary" onClick={() => navigate("/register")}>Join Now</button>
          </div>
        </div>
      </nav>

      {/* ══════ HERO ══════ */}
      <section className="ct-hero">
        <div className="ct-hero-bg">
          <div className="ct-hero-shape-1"></div>
          <div className="ct-hero-shape-2"></div>
        </div>
        <div className="ct-hero-content">
          <span className="ct-hero-badge">✨ Support Center</span>
          <h1 className="ct-hero-title">
            We are here to
            <br />
            <span className="ct-highlight">Help & Support</span>
          </h1>
          <p className="ct-hero-subtitle">
            Need assistance or have questions? Reach out to our dedicated support team 
            through any of the channels below. We are always ready to help.
          </p>
        </div>
      </section>

      {/* ══════ CONTACT INFO CARDS ══════ */}
      <section className="ct-info-section">
        <div className="ct-container">
          <div className="ct-info-grid">
            {contactInfo.map((info, index) => (
              <div className="ct-info-card" key={index}>
                <div className="ct-info-icon">{info.icon}</div>
                <h3 className="ct-info-title">{info.title}</h3>
                <p className="ct-info-detail">{info.detail}</p>
                <p className="ct-info-subtitle">{info.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ SOCIAL & COMMUNITY ══════ */}
      <section className="ct-social-section">
        <div className="ct-container">
          <div className="ct-social-card">
            <div className="ct-social-content">
              <h2>Join Our Community</h2>
              <p>Follow us on social media for the latest updates on social services and volunteer impact stories.</p>
              <div className="ct-social-links">
                <a href="#" className="ct-social-item">
                  <span className="ct-social-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width: '22px', height: '22px'}}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </span>
                  <span>Facebook</span>
                </a>
                <a href="#" className="ct-social-item">
                  <span className="ct-social-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width: '22px', height: '22px'}}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </span>
                  <span>Instagram</span>
                </a>
                <a href="#" className="ct-social-item">
                  <span className="ct-social-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width: '22px', height: '22px'}}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </span>
                  <span>LinkedIn</span>
                </a>
                <a href="#" className="ct-social-item">
                  <span className="ct-social-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width: '22px', height: '22px'}}><path d="M22 4s-1 1-2 1a4.4 4.4 0 0 0-7 1c-3.2-.2-6.3-1.6-8.3-3.8 0 0-3 3.5 0 9a11.4 11.4 0 0 1-6-2c0 4.2 2 7 6 8a10.6 10.6 0 0 1-7 1c1 3.2 4 5 8 5a11.5 11.4 0 0 0 10-10c0-.2 0-.4 0-.6a7.8 7.8 0 0 0 2-2z"></path></svg>
                  </span>
                  <span>Twitter</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ MAP ══════ */}
      <section className="ct-map-section">
        <div className="ct-container">
          <div className="ct-map-header">
            <span className="ct-section-tag">📍 Location</span>
            <h2 className="ct-section-title">Our Headquarters</h2>
          </div>
          <div className="ct-map-card">
            <div className="ct-map-placeholder">
              <div className="ct-map-pin">📍</div>
              <h3>SevaConnect Center</h3>
              <p>Ahmedabad, Gujarat, India — 380015</p>
              <a
                href="https://maps.google.com/?q=Ahmedabad,Gujarat,India"
                target="_blank"
                rel="noopener noreferrer"
                className="ct-map-link"
              >
                🗺️ View on Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ FAQ ══════ */}
      <section className="ct-faq-section">
        <div className="ct-container">
          <div className="ct-faq-header">
            <span className="ct-section-tag">❓ FAQ</span>
            <h2 className="ct-section-title">Quick Answers</h2>
            <p className="ct-section-subtitle">
              Common questions and helpful answers for our volunteers.
            </p>
          </div>
          <div className="ct-faq-grid">
            {faqs.map((faq, index) => (
              <div className="ct-faq-card" key={index}>
                <div className="ct-faq-number">{index + 1}</div>
                <h3 className="ct-faq-question">{faq.question}</h3>
                <p className="ct-faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="ct-cta-section">
        <div className="ct-container">
          <div className="ct-cta-content">
            <h2>Start Your Seva Journey Today</h2>
            <p>
              Be the change you want to see. Join our global family of volunteers 
              making a difference every single day.
            </p>
            <div className="ct-cta-buttons">
              <button
                className="ct-cta-btn ct-cta-btn-white"
                onClick={() => navigate("/register")}
              >
                🚀 Register Now
              </button>
              <button
                className="ct-cta-btn ct-cta-btn-outline"
                onClick={() => navigate("/public/services")}
              >
                🔍 Browse All Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="ct-footer">
        <div className="ct-footer-container">
          <p>© 2026 SevaConnect. Dedicated to Social Impact.</p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
