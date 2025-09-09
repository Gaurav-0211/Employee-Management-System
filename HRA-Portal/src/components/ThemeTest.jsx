// src/components/ThemeTest.jsx
import { useTheme } from "../context/ThemeContext";

export default function ThemeTest() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-6 space-y-4">
      <div className="p-6 bg-white text-black dark:bg-slate-900 dark:text-white rounded">
        <strong>Theme test box</strong>
        <div>Current theme: {theme}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          This box uses Tailwind's dark: classes.
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded bg-indigo-600 text-white"
        >
          Toggle via Context
        </button>

        <button
          onClick={() => {
            document.documentElement.classList.toggle("dark");
            console.log(
              "Manual toggle, html has dark:",
              document.documentElement.classList.contains("dark")
            );
          }}
          className="px-4 py-2 rounded border"
        >
          Manual html toggle (dev test)
        </button>
      </div>
    </div>
  );
}
