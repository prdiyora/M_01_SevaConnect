import { Navigate } from "react-router-dom";

const PublicRoute = ({ children, disableRedirect = false }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ✅ Allow Landing page to show even if logged in
  if (user && !disableRedirect) {
    if (user.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/user/home" replace />;
  }

  return children;
};

export default PublicRoute;
