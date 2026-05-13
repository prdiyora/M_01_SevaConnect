import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Verifying Access...</p>
      </div>
    );
  }

  // Normalize role check (handle 'ADMIN' vs 'ROLE_ADMIN')
  const checkRole = (userRole, required) => {
    if (!userRole || !required) return false;
    const normalizedUserRole = userRole.replace("ROLE_", "").toUpperCase();
    const normalizedRequired = required.replace("ROLE_", "").toUpperCase();
    return normalizedUserRole === normalizedRequired;
  };

  if (!user || !checkRole(user.role, requiredRole)) {
    console.warn("🚫 Access Denied: Role mismatch or not logged in.");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
