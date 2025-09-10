// src/App.jsx
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

// Layouts
import Layout from "./components/Layout";
import PublicLayout from "./layouts/PublicLayout";

// Public Pages
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";

// Protected Pages
import Attendance from "./pages/Attendance";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import EmployeeTracker from "./pages/EmployeeTracker";
import HolidayPage from "./pages/HolidayPage";
import Home from "./pages/Home";
import Leaves from "./pages/Leaves";
import LiveLocationShare from "./pages/LiveLocationShare";
import Performance from "./pages/Performance";
import Products from "./pages/Products";
import Project from "./pages/Project";
import SettingsPage from "./pages/SettingsPage";
import Supports from "./pages/Supports";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicLayout>
                <Login />
              </PublicLayout>
            }
          />
          <Route
            path="/register"
            element={
              <PublicLayout>
                <Register />
              </PublicLayout>
            }
          />
          <Route
            path="/send-forgot-link"
            element={
              <PublicLayout>
                <ForgotPassword />
              </PublicLayout>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicLayout>
                <ResetPassword />
              </PublicLayout>
            }
          />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/leaves" element={<Leaves />} />
              <Route path="/holiday" element={<HolidayPage />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/location" element={<EmployeeTracker />} />
              <Route path="/live-location" element={<LiveLocationShare />} />
              <Route path="/project" element={<Project />} />
              <Route path="/product" element={<Products />} />
              <Route path="/support" element={<Supports />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route
            path="/dashboard"
            element={<Navigate to="/dashboard" replace />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
