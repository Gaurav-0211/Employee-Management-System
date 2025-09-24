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
import { ThemeProvider } from "./context/ThemeProvider";
import Attendance from "./pages/Attendance";
import DailyAttendancePage from "./pages/DailyAttendancePage";
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
import WellnessDashboard from "./pages/WellnessDashboard";

export default function App() {
  return (
    <ThemeProvider>
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
                <Route path="/employees" element={<Employees />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/leaves" element={<Leaves />} />
                <Route path="/holiday" element={<HolidayPage />} />
                <Route path="/performance" element={<Performance />} />
                <Route path="/location" element={<EmployeeTracker />} />
                <Route path="/live-location" element={<LiveLocationShare />} />
                <Route path="/project" element={<Project />} />
                <Route path="/product" element={<Products />} />
                <Route path="/wellness" element={<WellnessDashboard />} />
                <Route path="/support" element={<Supports />} />
                <Route
                  path="/daily-attendance"
                  element={<DailyAttendancePage />}
                />
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
    </ThemeProvider>
  );
}
