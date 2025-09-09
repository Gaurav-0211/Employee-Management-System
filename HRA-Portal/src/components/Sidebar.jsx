// src/components/Sidebar.jsx
import {
  CalendarCheck,
  CalendarCheckIcon,
  CalendarDays,
  FolderKanban,
  Home,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menu = [
  { name: "Home", path: "/", icon: Home },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Employees", path: "/employees", icon: Users },
  { name: "Attendance", path: "/attendance", icon: CalendarCheck },
  { name: "Leaves", path: "/leaves", icon: CalendarDays },
  { name: "Holidays", path: "/holiday", icon: CalendarCheckIcon },
  { name: "Performance", path: "/performance", icon: TrendingUp },
  { name: "Projects", path: "/project", icon: FolderKanban },
  { name: "Products", path: "/product", icon: Package },
  { name: "Supports", path: "/support", icon: Package },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-white shadow-lg p-4 flex flex-col transition-all duration-300 relative mb-[-5rem]`}
    >
      {/* Top Section */}
      <div className="flex items-center mb-6 relative">
        {/* App Name (only visible when expanded) */}
        <h1
          className={`ml-2 text-2xl font-bold whitespace-nowrap transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          EMS
        </h1>

        {/* Hamburger Button (always visible, fixed top-right inside sidebar) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition absolute top-0 right-0"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 mt-6">
        {menu.map(({ name, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center ${
              sidebarOpen ? "gap-3 px-4" : "justify-center"
            } py-3 rounded-xl mb-2 transition-colors ${
              location.pathname === path
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {/* Icon always visible */}
            <Icon size={20} />

            {/* Text hides only when sidebar collapsed */}
            <span
              className={`transition-opacity duration-300 ${
                sidebarOpen ? "opacity-100" : "opacity-0 w-0"
              }`}
            >
              {name}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
