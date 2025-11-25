"use client";

export default function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-500 mb-1">
        {label}
      </div>
      {children}
    </label>
  );
}
