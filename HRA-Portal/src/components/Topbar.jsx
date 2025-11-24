import { Globe, LogOut, Menu, Moon, Sun, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeProvider";

export default function Topbar({ sidebarOpen, setSidebarOpen, visible }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [language, setLanguage] = useState("EN");

  return (
    <header
      className="fixed top-0 left-0 right-0 bg-gray-500 flex items-center justify-between px-6 py-2  shadow-md z-40 transition-transform duration-300"
      style={{
        transform: visible ? "translateY(0)" : "translateY(-100%)",
      }}
    >
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 rounded text-white hover:bg-gray-800"
      >
        <Menu size={22} />
      </button>

      <h2 className="text-lg ml-[-40rem] font-semibold text-white">
        Welcome to Employee Management System!
      </h2>

      <div className="flex items-center text-white gap-4">
        <button onClick={toggleTheme}>
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          onClick={() => setLanguage(language === "EN" ? "HI" : "EN")}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-600"
        >
          <Globe size={16} /> {language}
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-600"
          >
            <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
              {user?.name?.[0] || "U"}
            </div>
            <span>{user?.name || "Employee"}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-400 border rounded-lg shadow-lg">
              <button
                onClick={() => navigate("/settings")}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-600"
              >
                <User size={16} /> Profile
              </button>
              <button
                onClick={() => logout()}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-600 text-red-500"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
