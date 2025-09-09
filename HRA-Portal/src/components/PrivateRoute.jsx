// src/components/PrivateRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // store attempted path in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
