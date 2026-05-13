import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// Public Pages
import Landing from "../pages/public/Landing";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import Services from "../pages/public/Services";

// Admin Pages
import Dashboard from "../pages/admin/Dashboard";
import ManageVolunteers from "../pages/admin/ManageVolunteers";
import ManageEvents from "../pages/admin/ManageEvents";
import ManageRequests from "../pages/admin/ManageRequests";
import Reports from "../pages/admin/Reports";

// User Pages
import Home from "../pages/user/Home";
import Profile from "../pages/user/Profile";
import MyServices from "../pages/user/MyServices";
import Notifications from "../pages/user/Notifications";
import Settings from "../pages/user/Settings";
import ServiceDetails from "../pages/user/ServiceDetails";

// Layouts
import UserLayout from "../components/user/UserLayout";
import AdminLayout from "../components/admin/AdminLayout";

// Guards
import ProtectedRoute from "../components/common/ProtectedRoute";
import PublicRoute from "../components/common/PublicRoute";

const router = createBrowserRouter([
  // Public (guest only)
  { path: "/", element: <PublicRoute disableRedirect={true}><Landing /></PublicRoute> },
  { path: "/login", element: <PublicRoute><Login /></PublicRoute> },
  { path: "/register", element: <PublicRoute><Register /></PublicRoute> },

  // Public (always)
  { path: "/services", element: <Services /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },

  // Redirects
  { path: "/home", element: <Navigate to="/user/home" replace /> },
  { path: "/dashboard", element: <Navigate to="/admin/dashboard" replace /> },

  // User (VOLUNTEER)
  {
    path: "/user",
    element: (
      <ProtectedRoute requiredRole="VOLUNTEER">
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/user/home" replace /> },
      { path: "home", element: <Home /> },
      { path: "profile", element: <Profile /> },
      { path: "my-services", element: <MyServices /> },
      { path: "notifications", element: <Notifications /> },
      { path: "settings", element: <Settings /> },
      { path: "service/:id", element: <ServiceDetails /> },
    ],
  },

  // Admin (ADMIN)
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "volunteers", element: <ManageVolunteers /> },
      { path: "services", element: <ManageEvents /> },
      { path: "requests", element: <ManageRequests /> },
      { path: "reports", element: <Reports /> },
    ],
  },

  // Catch-all
  { path: "*", element: <Navigate to="/" replace /> },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
