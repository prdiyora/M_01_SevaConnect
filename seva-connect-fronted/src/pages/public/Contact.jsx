import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Contact.css";

const Contact = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    // Simulate sending (no API call)
    setTimeout(() => {
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setErrors({});
      setLoading(false);
      setTimeout(() => setSuccess(false), 5000);
    }, 1200);
  };

  const contactInfo = [
    {
      icon: "📧",
      title: "Email Us",
      detail: "info@sevaconnect.org",
      subtitle: "We reply within 24 hours",
    },
    {
      icon: "📞",
      title: "Call Us",
      detail: "+91 98765 43210",
      subtitle: "Mon-Sat, 9AM-6PM IST",
    },
    {
      icon: "📍",
      title: "Visit Us",
      detail: "Ahmedabad, Gujarat",
      subtitle: "India — 380015",
    },
    {
      icon: "⏰",
      title: "Working Hours",
      detail: "Mon - Sat",
      subtitle: "9:00 AM - 6:00 PM",
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
        "Absolutely! NGOs can register and post their volunteer requirements. Contact us for NGO onboarding.",
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
            <a
              href="#"
              className="ct-nav-link"
              onClick={(e) => {
                e.preventDefault();
                navigate("/about");
              }}
            >
              About
            </a>
            <a
              href="#"
              className="ct-nav-link"
              onClick={(e) => {
                e.preventDefault();
                navigate("/services");
              }}
            >
              Services
            </a>
          </div>
          <div className="ct-navbar-actions">
            <button
              className="ct-nav-btn ct-nav-btn-outline"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="ct-nav-btn ct-nav-btn-primary"
              onClick={() => navigate("/register")}
            >
              Join Now
            </button>
          </div>
        </div>
      </nav>

      {/* ══════ HERO ══════ */}
      <section className="ct-hero">
        <div className="ct-hero-bg">
          <div className="ct-hero-shape-1"></div>
          <div className="ct-hero-shape-2"></div>
          <div className="ct-hero-shape-3"></div>
        </div>
        <div className="ct-hero-content">
          <span className="ct-hero-badge">📞 Get in Touch</span>
          <h1 className="ct-hero-title">
            We'd Love to
            <br />
            <span className="ct-highlight">Hear From You</span>
          </h1>
          <p className="ct-hero-subtitle">
            Have a question, suggestion, or want to collaborate? Our team is
            ready to help you make a difference.
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

      {/* ══════ CONTACT FORM + INFO PANEL ══════ */}
      <section className="ct-form-section">
        <div className="ct-container">
          <div className="ct-form-grid">
            {/* Left — Purple Info Panel */}
            <div className="ct-left-panel">
              <div className="ct-left-content">
                <h2 className="ct-left-title">Contact Information</h2>
                <p className="ct-left-subtitle">
                  Fill out the form and our team will get back to you within 24
                  hours. You can also reach us directly.
                </p>

                <div className="ct-left-items">
                  <div className="ct-left-item">
                    <div className="ct-left-item-icon">📧</div>
                    <div>
                      <h4>Email</h4>
                      <p>info@sevaconnect.org</p>
                    </div>
                  </div>
                  <div className="ct-left-item">
                    <div className="ct-left-item-icon">📞</div>
                    <div>
                      <h4>Phone</h4>
                      <p>+91 98765 43210</p>
                    </div>
                  </div>
                  <div className="ct-left-item">
                    <div className="ct-left-item-icon">📍</div>
                    <div>
                      <h4>Address</h4>
                      <p>Ahmedabad, Gujarat, India</p>
                    </div>
                  </div>
                </div>

                <div className="ct-left-socials">
                  <h4>Follow Us</h4>
                  <div className="ct-social-links">
                    <a href="#" className="ct-social-link">📘</a>
                    <a href="#" className="ct-social-link">🐦</a>
                    <a href="#" className="ct-social-link">📸</a>
                    <a href="#" className="ct-social-link">💼</a>
                  </div>
                </div>

                <div className="ct-left-decor-1"></div>
                <div className="ct-left-decor-2"></div>
              </div>
            </div>

            {/* Right — Form Card */}
            <div className="ct-right-panel">
              <div className="ct-form-card">
                <h2 className="ct-form-title">Send us a Message</h2>
                <p className="ct-form-subtitle">
                  We're here to help. Fill out the form below.
                </p>

                {success && (
                  <div className="ct-alert ct-alert-success">
                    <span className="ct-alert-icon">✅</span>
                    <div>
                      <strong>Message Sent!</strong>
                      <p>We'll get back to you within 24 hours.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="ct-form">
                  {/* Name & Email Row */}
                  <div className="ct-form-row">
                    <div className="ct-field">
                      <label className="ct-label">
                        Full Name <span className="ct-required">*</span>
                      </label>
                      <div
                        className={`ct-input-wrapper ${
                          errors.name ? "ct-input-error" : ""
                        }`}
                      >
                        <span className="ct-input-icon">👤</span>
                        <input
                          type="text"
                          name="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={handleChange}
                          className="ct-input"
                        />
                      </div>
                      {errors.name && (
                        <span className="ct-error-text">{errors.name}</span>
                      )}
                    </div>

                    <div className="ct-field">
                      <label className="ct-label">
                        Email Address <span className="ct-required">*</span>
                      </label>
                      <div
                        className={`ct-input-wrapper ${
                          errors.email ? "ct-input-error" : ""
                        }`}
                      >
                        <span className="ct-input-icon">📧</span>
                        <input
                          type="email"
                          name="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="ct-input"
                        />
                      </div>
                      {errors.email && (
                        <span className="ct-error-text">{errors.email}</span>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="ct-field">
                    <label className="ct-label">Subject</label>
                    <div className="ct-input-wrapper">
                      <span className="ct-input-icon">📝</span>
                      <input
                        type="text"
                        name="subject"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleChange}
                        className="ct-input"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="ct-field">
                    <label className="ct-label">
                      Message <span className="ct-required">*</span>
                    </label>
                    <div
                      className={`ct-textarea-wrapper ${
                        errors.message ? "ct-input-error" : ""
                      }`}
                    >
                      <textarea
                        name="message"
                        placeholder="Tell us how we can help you..."
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        className="ct-textarea"
                        maxLength={500}
                      ></textarea>
                    </div>
                    {errors.message && (
                      <span className="ct-error-text">{errors.message}</span>
                    )}
                    <span className="ct-char-count">
                      {formData.message.length}/500
                    </span>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="ct-submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="ct-spinner"></span>
                    ) : (
                      <>📤 Send Message</>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ MAP ══════ */}
      <section className="ct-map-section">
        <div className="ct-container">
          <div className="ct-map-header">
            <span className="ct-section-tag">📍 Our Location</span>
            <h2 className="ct-section-title">Find Us Here</h2>
          </div>
          <div className="ct-map-card">
            <div className="ct-map-placeholder">
              <div className="ct-map-pin">📍</div>
              <h3>SevaConnect Headquarters</h3>
              <p>Ahmedabad, Gujarat, India — 380015</p>
              <a
                href="https://maps.google.com/?q=Ahmedabad,Gujarat,India"
                target="_blank"
                rel="noopener noreferrer"
                className="ct-map-link"
              >
                🗺️ Open in Google Maps
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
            <h2 className="ct-section-title">Frequently Asked Questions</h2>
            <p className="ct-section-subtitle">
              Quick answers to common questions about SevaConnect.
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
            <h2>Ready to Make a Difference?</h2>
            <p>
              Join SevaConnect today and become part of a community that cares.
              Your small step can change someone's world.
            </p>
            <div className="ct-cta-buttons">
              <button
                className="ct-cta-btn ct-cta-btn-white"
                onClick={() => navigate("/register")}
              >
                🚀 Join Now — It's Free
              </button>
              <button
                className="ct-cta-btn ct-cta-btn-outline"
                onClick={() => navigate("/services")}
              >
                🔍 Explore Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="ct-footer">
        <div className="ct-footer-container">
          <p>
            © 2026 SevaConnect. All rights reserved. Made with ❤️ for society.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
