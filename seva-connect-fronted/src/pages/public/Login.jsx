import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./Login.css";

const API_BASE_URL = "http://localhost:9090/auth";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // 🔑 Helper: Decode JWT to get role
  const decodeJWT = (token) => {
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_BASE_URL}/login`, {
        email: form.email,
        password: form.password,
      });

      console.log("✅ Login Response:", res.data);

      // ✅ Extract token & user info
      const token = res.data.token || res.data;
      const decodedToken = decodeJWT(token);
      console.log("Decoded Token:", decodedToken);

      const role = res.data.role || decodedToken?.role || "VOLUNTEER";

      const email = res.data.email || form.email;
      const name = res.data.name || "";
      const id = res.data.id || null;

      // ✅ Save token
      localStorage.setItem("token", token);

      // ✅ Save user object (role, email, etc.)
      const user = { id, email, name, role };
      localStorage.setItem("user", JSON.stringify(user));
      
      // ✅ Update AuthContext
      setUser(user);

      console.log("✅ Saved User:", user);

      // ✅ Redirect based on role
      if (role === "ADMIN" || role === "ROLE_ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user/home", { replace: true });
      }
    } catch (err) {
      console.error("❌ Login Error:", err.response);
      const backendMsg =
        err.response?.data?.message || err.response?.data?.error;
      setError(backendMsg || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Side - Branding */}
      <div className="login-left">
        <div className="login-left-content">
          <Link to="/" className="login-logo">🙏 SevaConnect</Link>
          <h1 className="login-left-heading">
            Welcome Back,{" "}
            <span className="highlight-text">Changemaker!</span>
          </h1>
          <p className="login-left-text">
            Continue your journey of making a difference. Your community needs you.
          </p>

          <div className="login-left-features">
            <div className="login-feature-item">
              <div className="login-feature-icon">🤝</div>
              <div>
                <h4>Reconnect</h4>
                <p>Pick up where you left off with your services</p>
              </div>
            </div>
            <div className="login-feature-item">
              <div className="login-feature-icon">📊</div>
              <div>
                <h4>Track Impact</h4>
                <p>See your contributions and volunteer hours</p>
              </div>
            </div>
            <div className="login-feature-item">
              <div className="login-feature-icon">🌍</div>
              <div>
                <h4>Explore New Services</h4>
                <p>Discover new ways to help your community</p>
              </div>
            </div>
          </div>

          <div className="login-left-stats">
            <div className="login-stat">
              <span className="login-stat-number">500+</span>
              <span className="login-stat-label">Volunteers</span>
            </div>
            <div className="login-stat">
              <span className="login-stat-number">120+</span>
              <span className="login-stat-label">Services</span>
            </div>
            <div className="login-stat">
              <span className="login-stat-number">1000+</span>
              <span className="login-stat-label">Lives Touched</span>
            </div>
          </div>
        </div>

        <div className="login-left-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="login-right">
        <div className="login-form-container">
          <Link to="/" className="login-mobile-logo">🙏 SevaConnect</Link>

          <div className="login-form-header">
            <h2>Sign In</h2>
            <p>Enter your credentials to access your account</p>
          </div>

          {error && (
            <div className="login-error">
              <span className="login-error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-input-group">
              <label htmlFor="email">Email Address</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">📧</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-input-group">
              <label htmlFor="password">Password</label>
              <div className="login-input-wrapper password-wrapper">
                <span className="login-input-icon">🔒</span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="login-remember">
                <input type="checkbox" />
                <span className="login-checkmark"></span>
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className={`login-submit-btn ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="login-spinner"></span>
              ) : (
                <>
                  Sign In
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="login-register-link">
            <p>
              Don't have an account?{" "}
              <Link to="/register">Create Account</Link>
            </p>
          </div>

          <div className="login-back-home">
            <Link to="/">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
