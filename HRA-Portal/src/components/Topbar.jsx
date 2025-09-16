import { Bell, Globe, LogOut, Moon, Settings, Sun, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeProvider";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState("EN");
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(3);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  // Search suggestions mock
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSuggestions([
        `Employee: ${query} Kumar`,
        `Project: ${query} Migration`,
        `Leave Request: ${query}`,
      ]);
    }, 300);
  }, [query]);

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md dark:bg-blue-500 relative">
      {/* Left side */}
      <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-100">
        Welcome to Employee Management System!
      </h2>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <Bell className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full bg-red-600 text-white">
                {unread}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-white border rounded-lg shadow-lg z-50">
              <div className="px-4 py-2 font-medium border-b dark:border-slate-800">
                Notifications
              </div>
              <div className="max-h-60 overflow-auto">
                <div className="px-4 py-2 text-sm">Leave approved for Anna</div>
                <div className="px-4 py-2 text-sm">New employee joined</div>
                <div className="px-4 py-2 text-sm">Attendance alert</div>
              </div>
              <button
                onClick={() => setUnread(0)}
                className="w-full text-center px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-green-500"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2 text-white">
          <button
            onClick={() => setLanguage(language === "EN" ? "HI" : "EN")}
            className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <Globe className="w-4 h-4" /> {language}
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
        >
          {/* show icon matching current theme (pick whichever UX you prefer) */}
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700" />
          )}
        </button>

        {/* Profile Section (unchanged) */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
              {user?.name?.[0] || "U"}
            </div>
            <span className="font-medium text-slate-700 dark:text-slate-100">
              {user?.name || "Employee"}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-white border rounded-lg shadow-lg">
              <button
                onClick={() => {
                  navigate("/settings");
                  setDropdownOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                <User size={18} /> Profile
              </button>
              <button
                onClick={() => {
                  navigate("/settings");
                  setDropdownOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                <Settings size={18} /> Update Profile
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-red-500"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl p-6 w-80">
            <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-100">
              Employee Details
            </h3>
            <p className="mb-2 text-slate-600 dark:text-slate-200">
              <strong>Name:</strong> {user?.name || "N/A"}
            </p>
            <p className="mb-2 text-slate-600 dark:text-slate-200">
              <strong>Email:</strong> {user?.email || "N/A"}
            </p>
            <p className="mb-2 text-slate-600 dark:text-slate-200">
              <strong>Role:</strong> {user?.role || "Employee"}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setProfileModalOpen(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
