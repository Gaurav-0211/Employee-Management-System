"use client";

export default function GhostButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-sm ${className}`}
    >
      {children}
    </button>
  );
}
