import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock department-wise performance data
const departmentPerformance = [
  { department: "HR", score: 72 },
  { department: "IT", score: 91 },
  { department: "Finance", score: 79 },
  { department: "Marketing", score: 65 },
  { department: "Sales", score: 88 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function Performance() {
  // Calculate summary stats
  const bestDept = departmentPerformance.reduce((a, b) =>
    a.score > b.score ? a : b
  );
  const worstDept = departmentPerformance.reduce((a, b) =>
    a.score < b.score ? a : b
  );

  return (
    <div className="space-y-10 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-indigo-700">
        Department Performance Dashboard
      </h1>

      {/* Summary Highlights */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Best Performing Department
          </h2>
          <p className="text-2xl font-bold text-green-600">
            {bestDept.department} ({bestDept.score}%)
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Needs Improvement
          </h2>
          <p className="text-2xl font-bold text-red-600">
            {worstDept.department} ({worstDept.score}%)
          </p>
        </div>
      </div>

      {/* Department Performance Bar Chart */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Department Scores (This Month)
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={departmentPerformance}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" radius={[8, 8, 0, 0]}>
              {departmentPerformance.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Contribution Pie Chart */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Department Contribution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={departmentPerformance}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="score"
              label={({ department }) => department}
            >
              {departmentPerformance.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Department Performance Table */}
      <div className="bg-white rounded-2xl shadow-md p-6 overflow-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Department Performance Details
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Department</th>
              <th className="p-3">Performance Score</th>
            </tr>
          </thead>
          <tbody>
            {departmentPerformance.map((dept, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{dept.department}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      dept.score >= 80
                        ? "bg-green-100 text-green-700"
                        : dept.score >= 70
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {dept.score}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
