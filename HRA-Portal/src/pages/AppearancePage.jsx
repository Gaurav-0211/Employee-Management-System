// src/pages/AppearancePage.jsx
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeProvider";

export default function AppearancePage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Appearance Settings
      </h1>

      <div className="flex items-center justify-between p-4 rounded-lg shadow-md dark:bg-gray-800 bg-gray-100">
        <div>
          <h3 className="font-semibold">Appearance</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Toggle between light and dark mode.
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
        >
          {theme === "dark" ? <Moon /> : <Sun />}
        </button>
      </div>
    </div>
  );
}
