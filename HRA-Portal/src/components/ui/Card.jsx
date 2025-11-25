"use client";

export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white dark:bg-gray-100 shadow-lg rounded-2xl p-6 ${className}`}
    >
      {children}
    </div>
  );
}
