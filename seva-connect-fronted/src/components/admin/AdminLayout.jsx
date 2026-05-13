import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState({});

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("user") || "{}");
    setAdmin(adminData);
  }, []);

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("user") || "{}");
    setAdmin(adminData);
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getAdminInitial = () => {
    if (admin?.name) return admin.name.charAt(0).toUpperCase();
    if (admin?.email) return admin.email.charAt(0).toUpperCase();
    return "A";
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/volunteers", label: "Manage Volunteers", icon: "👥" },
    { path: "/admin/services", label: "Manage Events", icon: "📅" },
    { path: "/admin/requests", label: "Manage Requests", icon: "📋" },
    { path: "/admin/reports", label: "Reports", icon: "📈" },
  ];

  const getPageTitle = () => {
    const current = navItems.find((item) => item.path === location.pathname);
    return current?.label || "Admin Dashboard";
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "admin-sidebar-open" : ""}`}>
        <div className="admin-sidebar-header">
          <div
            className="admin-sidebar-logo"
            onClick={() => navigate("/admin/dashboard")}
          >
            <span className="admin-logo-icon">🛠️</span>
            <span className="admin-logo-text">Admin Panel</span>
          </div>
        </div>

        <div className="admin-sidebar-user">
          <div className="admin-user-avatar">{getAdminInitial()}</div>
          <div className="admin-user-info">
            <h4>{admin?.name || "Admin"}</h4>
            <p>{admin?.email || ""}</p>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          <ul className="admin-nav-list">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `admin-nav-link ${isActive ? "admin-nav-active" : ""}`
                  }
                >
                  <span className="admin-nav-icon">{item.icon}</span>
                  <span className="admin-nav-label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          <button
            className="admin-nav-link admin-logout-btn"
            onClick={handleLogout}
          >
            <span className="admin-nav-icon">🚪</span>
            <span className="admin-nav-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="admin-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <h1 className="admin-page-title">{getPageTitle()}</h1>
          </div>
          <div className="admin-topbar-right">
            <div
              className="admin-topbar-user"
              onClick={() => navigate("/admin/profile")}
            >
              <div className="admin-topbar-avatar">{getAdminInitial()}</div>
              <span className="admin-topbar-name">{admin?.name || "Admin"}</span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
