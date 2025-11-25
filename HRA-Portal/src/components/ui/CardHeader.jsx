"use client";

export default function CardHeader({ title, subtitle, icon }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="flex items-center gap-3 text-lg font-semibold text-indigo-700 dark:text-indigo-700">
          {icon}
          <span>{title}</span>
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
