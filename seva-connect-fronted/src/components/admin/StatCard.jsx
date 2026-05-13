import React from "react";
import "./StatCard.css";

const StatCard = ({ icon, label, value, color }) => {
  return (
    <div className="stat-card" style={{ borderLeft: `5px solid ${color}` }}>
      <div className="stat-icon" style={{ backgroundColor: `${color}20`, color }}>
        {icon}
      </div>
      <div className="stat-info">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
};

export default StatCard;
