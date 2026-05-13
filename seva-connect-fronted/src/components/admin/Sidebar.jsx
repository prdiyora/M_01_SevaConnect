// src/components/admin/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <ul>
        <li>
          <NavLink to="/admin/dashboard" activeclassname="active">
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/services" activeclassname="active">
            Manage Events
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/volunteers" activeclassname="active">
            Manage Volunteers
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/requests" activeclassname="active">
            Manage Requests
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/reports" activeclassname="active">
            Reports
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
