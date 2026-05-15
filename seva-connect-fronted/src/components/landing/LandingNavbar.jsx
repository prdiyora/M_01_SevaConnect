import React from "react";
import { useNavigate } from "react-router-dom";

const LandingNavbar = ({ mobileMenuOpen, setMobileMenuOpen, scrollToSection, isLoggedIn }) => {
  const navigate = useNavigate();

  return (
    <nav className="landing-navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate("/")}>
          <span className="logo-icon">🙏</span>
          <span className="logo-text">SevaConnect</span>
        </div>

        <ul className={`navbar-links ${mobileMenuOpen ? "active" : ""}`}>
          <li><a onClick={() => scrollToSection("about")}>About</a></li>
          <li><a onClick={() => scrollToSection("features")}>Features</a></li>
          <li><a onClick={() => scrollToSection("services")}>Services</a></li>
          <li><a onClick={() => scrollToSection("how-it-works")}>How It Works</a></li>
          <li><a onClick={() => scrollToSection("testimonials")}>Testimonials</a></li>
          
          {/* Mobile-only Auth Container */}
          <li className="navbar-mobile-auth">
            {isLoggedIn ? (
              <button className="btn btn-primary btn-block" onClick={() => navigate("/user/home")}>
                Dashboard
              </button>
            ) : (
              <div className="mobile-auth-btns">
                <button className="btn btn-outline btn-block" onClick={() => navigate("/login")}>
                  Login
                </button>
                <button className="btn btn-primary btn-block" onClick={() => navigate("/register")}>
                  Join Now
                </button>
              </div>
            )}
          </li>
        </ul>

        {/* Desktop-only Auth Container */}
        <div className="navbar-desktop-auth">
          {isLoggedIn ? (
            <button className="btn btn-primary" onClick={() => navigate("/user/home")}>
              Dashboard
            </button>
          ) : (
            <div className="navbar-actions">
              <button className="btn btn-outline" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="btn btn-primary" onClick={() => navigate("/register")}>
                Join Now
              </button>
            </div>
          )}
        </div>

        <div
          className={`navbar-mobile-toggle ${mobileMenuOpen ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
