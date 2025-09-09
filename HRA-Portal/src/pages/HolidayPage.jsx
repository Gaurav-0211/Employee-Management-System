import {
  Briefcase,
  CalendarDays,
  HeartPulse,
  PartyPopper,
  Sun,
} from "lucide-react";
import { useState } from "react";

const holidays2025 = [
  { date: "2025-01-01", name: "New Year's Day", type: "Public" },
  { date: "2025-01-14", name: "Makar Sankranti", type: "Festival" },
  { date: "2025-01-26", name: "Republic Day", type: "Public" },
  { date: "2025-03-14", name: "Holi", type: "Festival" },
  { date: "2025-04-18", name: "Good Friday", type: "Public" },
  { date: "2025-05-01", name: "Labour Day", type: "Public" },
  { date: "2025-08-15", name: "Independence Day", type: "Public" },
  { date: "2025-08-27", name: "Janmashtami", type: "Festival" },
  { date: "2025-10-02", name: "Gandhi Jayanti", type: "Public" },
  { date: "2025-10-20", name: "Diwali", type: "Festival" },
  { date: "2025-12-25", name: "Christmas", type: "Public" },
];

const getIcon = (type) => {
  switch (type) {
    case "Public":
      return <CalendarDays className="w-6 h-6 text-blue-500" />;
    case "Festival":
      return <PartyPopper className="w-6 h-6 text-pink-500" />;
    case "Optional":
      return <Sun className="w-6 h-6 text-yellow-500" />;
    case "Medical":
      return <HeartPulse className="w-6 h-6 text-red-500" />;
    default:
      return <Briefcase className="w-6 h-6 text-gray-500" />;
  }
};

export default function HolidayPage() {
  const [selectedMonth, setSelectedMonth] = useState("All");

  const filteredHolidays =
    selectedMonth === "All"
      ? holidays2025
      : holidays2025.filter(
          (h) =>
            new Date(h.date).toLocaleString("default", { month: "long" }) ===
            selectedMonth
        );

  const months = [
    "All",
    ...Array.from({ length: 12 }, (_, i) =>
      new Date(2025, i).toLocaleString("default", { month: "long" })
    ),
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-700">
        🌸 Holiday Calendar 2025
      </h1>

      {/* Month Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {months.map((month) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(month)}
            className={`px-4 py-2 rounded-full text-sm font-medium shadow transition ${
              selectedMonth === month
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      {/* Holiday List */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredHolidays.map((holiday, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <div className="flex-shrink-0">{getIcon(holiday.type)}</div>
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {holiday.name}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(holiday.date).toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <span
                className={`text-xs px-2 py-1 mt-1 inline-block rounded-full ${
                  holiday.type === "Public"
                    ? "bg-blue-100 text-blue-700"
                    : holiday.type === "Festival"
                    ? "bg-pink-100 text-pink-700"
                    : holiday.type === "Optional"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {holiday.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredHolidays.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No holidays found for {selectedMonth}.
        </p>
      )}
    </div>
  );
}
