"use client";

export default function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] transition ${className}`}
    >
      {children}
    </button>
  );
}
