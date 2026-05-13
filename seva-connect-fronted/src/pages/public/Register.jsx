import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const API_BASE_URL = "http://localhost:9090/auth";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone: only allow digits, max 10
    if (name === "phone") {
      const onlyDigits = value.replace(/\D/g, ""); // remove non-digits
      if (onlyDigits.length > 10) return; // block more than 10 digits
      setForm({ ...form, phone: onlyDigits });

      // Live validation message
      if (onlyDigits.length > 0 && onlyDigits.length < 10) {
        setPhoneError("Phone number must be exactly 10 digits");
      } else {
        setPhoneError("");
      }
      return;
    }

    setForm({ ...form, [name]: value });
    setError("");
  };

  const validateForm = () => {
    // Phone validation: exactly 10 digits, starts with 6-9 (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(form.phone)) {
      setPhoneError("Enter a valid 10-digit phone number (starts with 6-9)");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPhoneError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/register`, form);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Left Side - Branding */}
      <div className="register-left">
        <div className="register-left-content">
          <Link to="/" className="register-logo">
            🙏 SevaConnect
          </Link>
          <h1 className="register-left-heading">
            Join the <span className="highlight-text">Movement!</span>
          </h1>
          <p className="register-left-text">
            Be part of a community that believes in making a difference. Every
            hand counts.
          </p>

          <div className="register-left-features">
            <div className="register-feature-item">
              <div className="register-feature-icon">🌱</div>
              <div>
                <h4>Start Your Journey</h4>
                <p>Begin volunteering and creating impact today</p>
              </div>
            </div>
            <div className="register-feature-item">
              <div className="register-feature-icon">🤝</div>
              <div>
                <h4>Connect with Others</h4>
                <p>Join a network of passionate changemakers</p>
              </div>
            </div>
            <div className="register-feature-item">
              <div className="register-feature-icon">🏆</div>
              <div>
                <h4>Earn Recognition</h4>
                <p>Get badges and certificates for your contributions</p>
              </div>
            </div>
          </div>

          <div className="register-left-stats">
            <div className="register-stat">
              <span className="register-stat-number">500+</span>
              <span className="register-stat-label">Volunteers</span>
            </div>
            <div className="register-stat">
              <span className="register-stat-number">120+</span>
              <span className="register-stat-label">Services</span>
            </div>
            <div className="register-stat">
              <span className="register-stat-number">1000+</span>
              <span className="register-stat-label">Lives Touched</span>
            </div>
          </div>
        </div>

        <div className="register-left-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="register-right">
        <div className="register-form-container">
          <Link to="/" className="register-mobile-logo">
            🙏 SevaConnect
          </Link>

          <div className="register-form-header">
            <h2>Create Account</h2>
            <p>Fill in your details to get started</p>
          </div>

          {error && (
            <div className="register-error">
              <span className="register-error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            {/* Name Field */}
            <div className="register-input-group">
              <label htmlFor="name">Full Name</label>
              <div className="register-input-wrapper">
                <span className="register-input-icon">👤</span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="register-input-group">
              <label htmlFor="email">Email Address</label>
              <div className="register-input-wrapper">
                <span className="register-input-icon">📧</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="register-input-group">
              <label htmlFor="phone">Phone Number</label>
              <div className="register-input-wrapper">
                <span className="register-input-icon">📱</span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={10}
                  pattern="[6-9][0-9]{9}"
                  title="Please enter a valid 10-digit phone number"
                  required
                />
              </div>
              {/* Phone Error Message */}
              {phoneError && (
                <span className="register-phone-error">{phoneError}</span>
              )}
              {/* Digit Counter */}
              <span className="register-phone-counter">
                {form.phone.length}/10 digits
              </span>
            </div>

            {/* City Field */}
            <div className="register-input-group">
              <label htmlFor="city">City</label>
              <div className="register-input-wrapper">
                <span className="register-input-icon">🌆</span>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Enter your city"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="register-input-group">
              <label htmlFor="password">Password</label>
              <div className="register-input-wrapper">
                <span className="register-input-icon">🔒</span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="register-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`register-submit-btn ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="register-spinner"></span>
              ) : (
                <>
                  Create Account
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="register-login-link">
            <p>
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>

          <div className="register-back-home">
            <Link to="/">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
