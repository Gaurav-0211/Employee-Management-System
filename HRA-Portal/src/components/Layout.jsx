import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [topVisible, setTopVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll for Topbar show/hide
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setTopVisible(false); // scrolling down
      } else {
        setTopVisible(true); // scrolling up
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-blue-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} topVisible={topVisible} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          visible={topVisible}
        />

        {/* Main content */}
        <main
          className={`flex-1 overflow-auto transition-all duration-300 p-6`}
          style={{
            marginLeft: sidebarOpen ? 256 : 80, // Sidebar width
            marginTop: 64, // Topbar height
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
