// src/components/Sidebar.jsx
import {
  Briefcase,
  CalendarCheck,
  CalendarDays,
  CalendarHeart,
  Compass,
  Headset,
  HeartPulse,
  Home,
  MapPin,
  Menu,
  Package,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menu = [
  { name: "Home", path: "/", icon: Home },
  { name: "Employees", path: "/employees", icon: Users },
  { name: "Attendance", path: "/attendance", icon: CalendarCheck },
  { name: "Daily Attendance", path: "/daily-attendance", icon: CalendarCheck },
  { name: "Leaves", path: "/leaves", icon: CalendarDays },
  { name: "Holidays", path: "/holiday", icon: CalendarHeart },
  { name: "Performance", path: "/performance", icon: TrendingUp },
  { name: "Track Employee", path: "/location", icon: Compass },
  { name: "Send Location", path: "/live-location", icon: MapPin },
  { name: "Wellness and Care", path: "/wellness", icon: HeartPulse },
  { name: "Projects", path: "/project", icon: Briefcase },
  { name: "Products", path: "/product", icon: Package },
  { name: "Supports", path: "/support", icon: Headset },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } h-screen bg-white shadow-lg flex flex-col transition-all duration-300`}
    >
      {/* Top Section */}
      <div className="flex items-center relative p-4 border-b">
        <h1
          className={`ml-2 text-2xl font-bold whitespace-nowrap transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          EMS
        </h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition absolute top-1 right-1"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Navigation Menu (scrollable area) */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {menu.map(({ name, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center ${
              sidebarOpen ? "gap-3 px-4" : "justify-center"
            } py-3 rounded-xl mb-1 transition-colors ${
              location.pathname === path
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            <Icon size={20} />
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
