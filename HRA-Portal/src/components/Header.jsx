// src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        {/* Title */}
        <h1 className="text-lg md:text-3xl font-bold tracking-wide">
          Welcome to Employee Management System
        </h1>

        {/* Auth Links */}
        <nav className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="hover:underline font-medium text-lg transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:underline font-medium text-lg transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm md:text-base">
                Hello, <strong>{user.name || "User"}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-indigo-600 px-3 py-1 rounded-md hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
