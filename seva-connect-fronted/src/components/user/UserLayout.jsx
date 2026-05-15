import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import "./UserLayout.css";

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));

  // ✅ Refresh user data when route changes (in case settings updated it)
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    // ✅ Only logout when user explicitly clicks this button
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  const navItems = [
    { path: "/user/home", label: "Dashboard", icon: "🏠" },
    { path: "/user/profile", label: "Profile", icon: "👤" },
    { path: "/user/my-services", label: "My Events", icon: "📋" },
    { path: "/user/notifications", label: "Notifications", icon: "🔔" },
    { path: "/user/settings", label: "Settings", icon: "⚙️" },
  ];

  const getPageTitle = () => {
    const current = navItems.find((item) => item.path === location.pathname);
    if (location.pathname.includes("/user/service/")) return "Event Details";
    return current?.label || "Dashboard";
  };

  return (
    <div className="ul-layout">
      {/* ══════ SIDEBAR ══════ */}
      <aside className={`ul-sidebar ${sidebarOpen ? "ul-sidebar-open" : ""}`}>
        {/* Header — Logo goes to USER home, not public landing */}
        <div className="ul-sidebar-header">
          <div
            className="ul-sidebar-logo"
            onClick={() => navigate("/user/home")}
          >
            <span className="ul-logo-icon">🙏</span>
            <span className="ul-logo-text">SevaConnect</span>
          </div>
        </div>

        {/* User Info */}
        <div className="ul-sidebar-user">
          <div className="ul-user-avatar">{getUserInitial()}</div>
          <div className="ul-user-info">
            <h4>{user?.name || "Volunteer"}</h4>
            <p>{user?.email || ""}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="ul-sidebar-nav">
          <ul className="ul-nav-list">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `ul-nav-link ${isActive ? "ul-nav-active" : ""}`
                  }
                >
                  <span className="ul-nav-icon">{item.icon}</span>
                  <span className="ul-nav-label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer — Logout */}
        <div className="ul-sidebar-footer">
          <button
            className="ul-nav-link ul-logout-btn"
            onClick={handleLogout}
          >
            <span className="ul-nav-icon">🚪</span>
            <span className="ul-nav-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* ══════ MOBILE OVERLAY ══════ */}
      {sidebarOpen && (
        <div
          className="ul-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* ══════ MAIN ══════ */}
      <div className="ul-main">
        {/* Top Bar */}
        <header className="ul-topbar">
          <div className="ul-topbar-left">
            <button
              className="ul-mobile-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <h1 className="ul-page-title">{getPageTitle()}</h1>
          </div>
          <div className="ul-topbar-right">
            <button
              className="ul-topbar-notification"
              onClick={() => navigate("/user/notifications")}
            >
              🔔
            </button>
            <div
              className="ul-topbar-user"
              onClick={() => navigate("/user/profile")}
            >
              <div className="ul-topbar-avatar">{getUserInitial()}</div>
              <span className="ul-topbar-name">{user?.name || "User"}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="ul-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
