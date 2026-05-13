import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { 
  fetchDashboardStats, 
  fetchEventsByCategoryReport, 
  fetchMonthlyGrowthReport 
} from "../../services/adminApi";
import "./Reports.css";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        // Use allSettled to ensure partial data still renders if one endpoint fails
        const results = await Promise.allSettled([
          fetchDashboardStats(),
          fetchEventsByCategoryReport(),
          fetchMonthlyGrowthReport(),
        ]);

        if (results[0].status === "fulfilled") setStats(results[0].value);
        if (results[1].status === "fulfilled") setCategoryData(results[1].value);
        if (results[2].status === "fulfilled") setGrowthData(results[2].value);
        
      } catch (error) {
        console.error("Error in loadAllData:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  if (loading) {
    return (
      <div className="reports-loading">
        <div className="loader"></div>
        <p>Generating high-fidelity reports...</p>
      </div>
    );
  }

  // --- Chart Data Preparation ---

  // 1. Category Distribution (Pie Chart)
  const pieData = {
    labels: categoryData.map(item => item[0]),
    datasets: [
      {
        data: categoryData.map(item => item[1]),
        backgroundColor: [
          "#6366f1", // Indigo
          "#ec4899", // Pink
          "#8b5cf6", // Violet
          "#10b981", // Emerald
          "#f59e0b", // Amber
          "#3b82f6", // Blue
        ],
        borderWidth: 0,
      },
    ],
  };

  // 2. Monthly Growth (Line Chart)
  const lineData = {
    labels: growthData.map(item => item[0].trim()),
    datasets: [
      {
        label: "New Registrations",
        data: growthData.map(item => item[1]),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  // 3. Comparison Stats (Bar Chart)
  const barData = {
    labels: ["Pending", "Approved", "Total Impact"],
    datasets: [
      {
        label: "Requests Status",
        data: [
          stats?.pendingRequests || 0,
          stats?.approvedRequests || 0,
          stats?.totalImpact || 0
        ],
        backgroundColor: ["#f59e0b", "#10b981", "#6366f1"],
        borderRadius: 12,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { usePointStyle: true, padding: 20 } },
    },
  };

  return (
    <div className="rp-container">
      {/* Header Section */}
      <div className="rp-header">
        <div className="rp-title-group">
          <h1>Analytics & Reports</h1>
          <p>Real-time platform performance and volunteer impact metrics.</p>
        </div>
        <button className="rp-export-btn" onClick={() => window.print()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export PDF
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="rp-stats-grid">
        <div className="rp-stat-card">
          <div className="rp-stat-icon volunteers">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="rp-stat-info">
            <span className="rp-stat-label">Total Volunteers</span>
            <h2 className="rp-stat-value">{stats?.totalVolunteers || 0}</h2>
          </div>
        </div>

        <div className="rp-stat-card">
          <div className="rp-stat-icon events">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div className="rp-stat-info">
            <span className="rp-stat-label">Total Events</span>
            <h2 className="rp-stat-value">{stats?.totalEvents || 0}</h2>
          </div>
        </div>

        <div className="rp-stat-card">
          <div className="rp-stat-icon impact">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <div className="rp-stat-info">
            <span className="rp-stat-label">Conversion Rate</span>
            <h2 className="rp-stat-value">{stats?.conversionRate || 0}%</h2>
          </div>
        </div>
        
        <div className="rp-stat-card">
          <div className="rp-stat-icon volunteers">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div className="rp-stat-info">
            <span className="rp-stat-label">Engagement Score</span>
            <h2 className="rp-stat-value">{stats?.engagementScore || 0}</h2>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="rp-charts-section">
        <div className="rp-chart-card wide">
          <div className="rp-chart-header">
            <h3>Monthly Participation Growth</h3>
            <p>Tracking volunteer engagement over time.</p>
          </div>
          <div className="rp-chart-container">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>

        <div className="rp-chart-card">
          <div className="rp-chart-header">
            <h3>Event Distribution</h3>
            <p>Popular categories by volume.</p>
          </div>
          <div className="rp-chart-container pie">
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>

        <div className="rp-chart-card">
          <div className="rp-chart-header">
            <h3>Request Lifecycle</h3>
            <p>Conversion from pending to impact.</p>
          </div>
          <div className="rp-chart-container">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
