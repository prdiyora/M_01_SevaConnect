import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaClock, 
  FaCheckCircle, 
  FaHandsHelping,
  FaPlus,
  FaTasks,
  FaChartBar,
  FaArrowRight
} from "react-icons/fa";
import { fetchDashboardStats } from "../../services/adminApi";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    totalEvents: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    totalImpact: 0,
    conversionRate: 0,
    engagementScore: 0,
    communityReach: 0,
    recentRequests: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Command Center</h1>
        <p>Real-time overview and management of SevaConnect operations.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card purple-gradient">
          <div className="stat-icon"><FaUsers /></div>
          <div className="stat-info">
            <h3>Volunteers</h3>
            <p className="stat-number">{stats.totalVolunteers}</p>
            <span className="stat-subtext">Registered Users</span>
          </div>
        </div>

        <div className="stat-card blue-gradient">
          <div className="stat-icon"><FaCalendarAlt /></div>
          <div className="stat-info">
            <h3>Total Events</h3>
            <p className="stat-number">{stats.totalEvents}</p>
            <span className="stat-subtext">Live Opportunities</span>
          </div>
        </div>

        <div className="stat-card orange-gradient">
          <div className="stat-icon"><FaClock /></div>
          <div className="stat-info">
            <h3>Conversion</h3>
            <p className="stat-number">{stats.conversionRate}%</p>
            <span className="stat-subtext">Approval Velocity</span>
          </div>
        </div>

        <div className="stat-card green-gradient">
          <div className="stat-icon"><FaCheckCircle /></div>
          <div className="stat-info">
            <h3>Engagement</h3>
            <p className="stat-number">{stats.engagementScore}</p>
            <span className="stat-subtext">Volunteers / Event</span>
          </div>
        </div>

        <div className="stat-card indigo-gradient">
          <div className="stat-icon"><FaHandsHelping /></div>
          <div className="stat-info">
            <h3>Total Impact</h3>
            <p className="stat-number">{stats.totalImpact}</p>
            <span className="stat-subtext">Life-time Actions</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/admin/services" className="action-card">
            <div className="action-icon plus-icon"><FaPlus /></div>
            <div className="action-text">
              <h4>Create Event</h4>
              <p>Launch a new service opportunity</p>
            </div>
            <FaArrowRight className="arrow-icon" />
          </Link>

          <Link to="/admin/requests" className="action-card">
            <div className="action-icon tasks-icon"><FaTasks /></div>
            <div className="action-text">
              <h4>Review Requests</h4>
              <p>Manage volunteer applications</p>
            </div>
            <FaArrowRight className="arrow-icon" />
          </Link>

          <Link to="/admin/reports" className="action-card">
            <div className="action-icon chart-icon"><FaChartBar /></div>
            <div className="action-text">
              <h4>View Reports</h4>
              <p>Analyze impact and engagement</p>
            </div>
            <FaArrowRight className="arrow-icon" />
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Recent Volunteer Requests</h2>
          <Link to="/admin/requests" className="view-all-link">View All</Link>
        </div>
        <div className="activity-card">
          {stats.recentRequests && stats.recentRequests.length > 0 ? (
            <div className="table-responsive">
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Volunteer</th>
                    <th>Event</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentRequests.map((request) => (
                    <tr key={request.id}>
                      <td>
                        <div className="user-info">
                          <span className="user-name">{request.volunteerName}</span>
                          <span className="user-email">{request.volunteerEmail}</span>
                        </div>
                      </td>
                      <td>{request.eventTitle}</td>
                      <td>
                        <span className={`status-badge ${request.status.toLowerCase()}`}>
                          <span className="status-dot"></span>
                          {request.status}
                        </span>
                      </td>
                      <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-activity">
              <p>No recent volunteer requests found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
