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

export default function Sidebar({ sidebarOpen, topVisible }) {
  const location = useLocation();

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100%-64px)] bg-white shadow-lg transition-all duration-300 z-30 overflow-auto`}
      style={{
        width: sidebarOpen ? 256 : 80,
        transform: topVisible ? "translateY(0)" : "translateY(-64px)",
      }}
    >
      <nav className="flex flex-col mt-2 px-2 py-4 gap-1">
        {menu.map(({ name, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center ${
              sidebarOpen ? "gap-3 px-4" : "justify-center"
            } py-3 rounded-xl transition-colors ${
              location.pathname === path
                ? "bg-gray-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            <Icon size={20} />
            <span
              className={`transition-opacity duration-300 whitespace-nowrap ${
                sidebarOpen ? "opacity-100" : "opacity-0 w-0"
              }`}
            >
              {name}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
