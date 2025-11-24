// import { AnimatePresence, motion } from "framer-motion";
// import { ChevronDown, Download, RefreshCcw, Search } from "lucide-react";
// import { useEffect, useMemo, useState } from "react";
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Cell,
//   Pie,
//   PieChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

// // Mock department-wise performance data across months
// const MOCK_DATA = [
//   { month: "Jan", HR: 72, IT: 91, Finance: 79, Marketing: 65, Sales: 88 },
//   { month: "Feb", HR: 75, IT: 86, Finance: 82, Marketing: 70, Sales: 84 },
//   { month: "Mar", HR: 68, IT: 94, Finance: 77, Marketing: 69, Sales: 90 },
//   { month: "Apr", HR: 78, IT: 89, Finance: 81, Marketing: 72, Sales: 85 },
//   { month: "May", HR: 72, IT: 91, Finance: 79, Marketing: 65, Sales: 88 },
//   { month: "Jun", HR: 74, IT: 88, Finance: 80, Marketing: 68, Sales: 87 },
//   { month: "Jul", HR: 77, IT: 92, Finance: 83, Marketing: 71, Sales: 89 },
//   { month: "Aug", HR: 73, IT: 90, Finance: 78, Marketing: 67, Sales: 86 },
//   { month: "Sep", HR: 76, IT: 87, Finance: 82, Marketing: 70, Sales: 84 },
//   { month: "Oct", HR: 79, IT: 93, Finance: 85, Marketing: 73, Sales: 91 },
// ];

// const DEPARTMENTS = ["HR", "IT", "Finance", "Marketing", "Sales"];
// const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

// // Small reusable stat card
// function StatCard({ title, value, delta, icon, accent = "green" }) {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.03 }}
//       className="bg-white  rounded-2xl p-5 shadow hover:shadow-lg transition"
//     >
//       <div className="flex items-center justify-between gap-4">
//         <div>
//           <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-600">
//             {title}
//           </p>
//           <div className="mt-1 flex items-baseline gap-3">
//             <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-600">
//               {value}
//             </div>
//             <span
//               className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
//                 accent === "green"
//                   ? "bg-green-100 text-green-700"
//                   : "bg-red-100 text-red-700"
//               }`}
//             >
//               {delta}
//             </span>
//           </div>
//         </div>
//         <div className="text-indigo-500 dark:text-indigo-400">{icon}</div>
//       </div>
//     </motion.div>
//   );
// }

// // Tiny sparkline
// function Sparkline({ values }) {
//   const width = 120;
//   const height = 28;
//   const max = Math.max(...values);
//   const min = Math.min(...values);
//   const points = values
//     .map((v, i) => {
//       const x = (i / (values.length - 1)) * width;
//       const y = height - ((v - min) / (max - min || 1)) * height;
//       return `${x},${y}`;
//     })
//     .join(" ");

//   return (
//     <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
//       <polyline
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         points={points}
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         className="text-indigo-500"
//       />
//     </svg>
//   );
// }

// // CSV export
// function downloadCSV(rows, filename = "department_performance.csv") {
//   if (!rows?.length) return;
//   const headers = Object.keys(rows[0]);
//   const csv = [headers.join(",")] // headers
//     .concat(rows.map((r) => headers.map((h) => r[h]).join(",")))
//     .join("\n");
//   const blob = new Blob([csv], { type: "text/csv" });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = filename;
//   a.click();
//   URL.revokeObjectURL(url);
// }

// export default function Performance() {
//   const [dark, setDark] = useState(false);
//   const [selectedMonth, setSelectedMonth] = useState("May");
//   const [visibleDepartments, setVisibleDepartments] = useState(
//     new Set(DEPARTMENTS)
//   );
//   const [expanded, setExpanded] = useState(false);
//   const [search, setSearch] = useState("");
//   const [sortBy, setSortBy] = useState("score");

//   // derived data
//   const departmentPerformance = useMemo(() => {
//     const row =
//       MOCK_DATA.find((r) => r.month === selectedMonth) || MOCK_DATA[0];
//     return DEPARTMENTS.map((d) => ({ department: d, score: row[d] }));
//   }, [selectedMonth]);

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", dark);
//   }, [dark]);

//   const bestDept = useMemo(
//     () => departmentPerformance.reduce((a, b) => (a.score > b.score ? a : b)),
//     [departmentPerformance]
//   );
//   const worstDept = useMemo(
//     () => departmentPerformance.reduce((a, b) => (a.score < b.score ? a : b)),
//     [departmentPerformance]
//   );

//   const pieData = departmentPerformance.map((d, i) => ({
//     name: d.department,
//     value: d.score,
//     color: COLORS[i],
//   }));

//   const tableRows = useMemo(() => {
//     const filtered = departmentPerformance.filter((d) =>
//       d.department.toLowerCase().includes(search.toLowerCase())
//     );
//     const sorted = [...filtered].sort((a, b) =>
//       sortBy === "score"
//         ? b.score - a.score
//         : a.department.localeCompare(b.department)
//     );
//     return sorted;
//   }, [departmentPerformance, search, sortBy]);

//   const trends = useMemo(() => {
//     const result = {};
//     DEPARTMENTS.forEach((d) => {
//       result[d] = MOCK_DATA.map((m) => m[d]);
//     });
//     return result;
//   }, []);

//   return (
//     <div className="min-h-screen p-6 bg-gradient-to-br ">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-600">
//               Department Performance
//             </h1>
//             <p className="text-sm text-slate-600 dark:text-slate-500">
//               Interactive dashboard with filters, exports, and insights.
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             <select
//               value={selectedMonth}
//               onChange={(e) => setSelectedMonth(e.target.value)}
//               className="rounded-xl px-3 py-2 shadow bg-indigo-600 text-white hover:bg-indigo-700 transition"
//             >
//               {MOCK_DATA.map((m) => (
//                 <option key={m.month} value={m.month}>
//                   {m.month}
//                 </option>
//               ))}
//             </select>

//             <button
//               className="px-3 py-2 rounded-xl bg-indigo-600 text-white shadow hover:bg-indigo-700 flex items-center gap-2"
//               onClick={() =>
//                 downloadCSV(
//                   MOCK_DATA.map((r) => ({ month: r.month, ...r })),
//                   `performance_${selectedMonth}.csv`
//                 )
//               }
//             >
//               <Download size={16} /> Export
//             </button>
//           </div>
//         </header>

//         {/* Overview */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
//           <div className="lg:col-span-2 bg-white  rounded-2xl p-6 shadow">
//             <div className="flex items-start justify-between">
//               <div>
//                 <p className="text-sm text-slate-500 dark:text-slate-600">
//                   Best:{" "}
//                   <span className="font-bold text-green-600">
//                     {bestDept.department}
//                   </span>{" "}
//                   — {bestDept.score}%
//                 </p>
//                 <p className="text-sm text-slate-500 dark:text-slate-600">
//                   Lowest:{" "}
//                   <span className="font-bold text-red-600">
//                     {worstDept.department}
//                   </span>{" "}
//                   — {worstDept.score}%
//                 </p>
//               </div>
//               <ResponsiveContainer width="40%" height={100}>
//                 <BarChart data={MOCK_DATA}>
//                   <XAxis dataKey="month" hide />
//                   <YAxis hide />
//                   <Tooltip />
//                   {DEPARTMENTS.map((d, i) => (
//                     <Bar key={d} dataKey={d} stackId="a">
//                       {MOCK_DATA.map((_, idx) => (
//                         <Cell key={idx} fill={COLORS[i]} />
//                       ))}
//                     </Bar>
//                   ))}
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <StatCard
//             title="Avg Score"
//             value={`${Math.round(
//               departmentPerformance.reduce((a, b) => a + b.score, 0) /
//                 departmentPerformance.length
//             )}%`}
//             delta="+2%"
//             icon={<ChevronDown />}
//           />
//           <StatCard
//             title="Departments"
//             value={DEPARTMENTS.length}
//             delta="Stable"
//             icon={<RefreshCcw />}
//           />
//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           {/* Department Scores */}
//           <motion.div
//             whileHover={{ scale: 1.02 }}
//             className="bg-white  rounded-2xl p-4 shadow"
//           >
//             <h4 className="text-sm text-slate-600 dark:text-slate-600">
//               Scores
//             </h4>
//             <ResponsiveContainer width="100%" height={220}>
//               <BarChart data={departmentPerformance}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="department" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="score" radius={[6, 6, 0, 0]}>
//                   {departmentPerformance.map((_, i) => (
//                     <Cell key={i} fill={COLORS[i]} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </motion.div>

//           {/* Contribution Pie */}
//           <motion.div
//             whileHover={{ scale: 1.02 }}
//             className="bg-white  rounded-2xl p-4 shadow"
//           >
//             <h4 className="text-sm text-slate-600 dark:text-slate-600">
//               Contribution
//             </h4>
//             <ResponsiveContainer width="100%" height={220}>
//               <PieChart>
//                 <Pie data={pieData} dataKey="value" outerRadius={80}>
//                   {pieData.map((entry, i) => (
//                     <Cell key={i} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </motion.div>

//           {/* Trends */}
//           <motion.div
//             whileHover={{ scale: 1.02 }}
//             className="bg-white  rounded-2xl p-4 shadow"
//           >
//             <h4 className="text-sm text-slate-600 dark:text-slate-600">
//               Trends
//             </h4>
//             <div className="mt-3 space-y-3">
//               {DEPARTMENTS.map((d, i) => (
//                 <div key={d} className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <span
//                       className="w-2 h-6 rounded"
//                       style={{ background: COLORS[i] }}
//                     ></span>
//                     <span className="text-sm font-medium text-slate-700 dark:text-slate-600">
//                       {d}
//                     </span>
//                   </div>
//                   <Sparkline values={trends[d]} />
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         </div>

//         {/* Expandable Details */}
//         <AnimatePresence>
//           {expanded && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               className="overflow-hidden"
//             >
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                 <div className="bg-white  rounded-2xl p-4 shadow">
//                   <h4 className="text-sm text-slate-600 dark:text-slate-600">
//                     Monthly Breakdown
//                   </h4>
//                   <ResponsiveContainer width="100%" height={250}>
//                     <BarChart data={MOCK_DATA}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="month" />
//                       <YAxis />
//                       <Tooltip />
//                       {DEPARTMENTS.map((d, idx) => (
//                         <Bar key={d} dataKey={d} fill={COLORS[idx]} />
//                       ))}
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>

//                 <div className="bg-white  rounded-2xl p-4 shadow">
//                   <h4 className="text-sm text-slate-600 dark:text-slate-600">
//                     Insights
//                   </h4>
//                   <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-600">
//                     <li>• IT leads consistently — share practices.</li>
//                     <li>• Marketing fluctuates — training needed.</li>
//                     <li>• Sales spikes correlate with IT strength.</li>
//                   </ul>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Table */}
//         <div className="bg-white  rounded-2xl p-4 shadow">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <Search size={16} className="text-slate-400" />
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search..."
//                 className="px-2 py-1 border-b outline-none bg-transparent"
//               />
//             </div>
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="rounded px-2 py-1 border bg-white dark:bg-slate-500 text-white"
//             >
//               <option value="score">Sort by Score</option>
//               <option value="department">Sort by Name</option>
//             </select>
//           </div>

//           <table className="w-full text-sm">
//             <thead>
//               <tr className="bg-slate-100 dark:bg-slate-500 text-white">
//                 <th className="p-2 text-left">Department</th>
//                 <th className="p-2">Score</th>
//                 <th className="p-2">Trend</th>
//                 <th className="p-2">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tableRows.map((dept, idx) => (
//                 <tr
//                   key={idx}
//                   className="border-b hover:bg-slate-50 dark:hover:bg-slate-400 transition"
//                 >
//                   <td className="p-2 font-medium text-slate-700 dark:text-slate-600">
//                     {dept.department}
//                   </td>
//                   <td className="p-2 text-center">
//                     <div className="inline-flex items-center gap-2">
//                       <div className="text-sm font-semibold">{dept.score}%</div>
//                       <div
//                         className={`px-2 py-0.5 rounded-full text-xs font-medium ${
//                           dept.score >= 80
//                             ? "bg-green-100 text-green-700"
//                             : dept.score >= 70
//                             ? "bg-yellow-100 text-yellow-700"
//                             : "bg-red-100 text-red-700"
//                         }`}
//                       >
//                         {dept.score >= 80
//                           ? "Excellent"
//                           : dept.score >= 70
//                           ? "Good"
//                           : "Needs Work"}
//                       </div>
//                     </div>
//                   </td>

//                   <td className="p-2 text-center">
//                     <Sparkline values={trends[dept.department]} />
//                   </td>

//                   <td className="p-2 text-center">
//                     <div className="flex items-center justify-center gap-2">
//                       <motion.button
//                         whileHover={{ scale: 1.04 }}
//                         onClick={() => alert(`${dept.department} details`)}
//                         className="px-3 py-1 rounded-lg border text-white bg-white dark:bg-slate-500"
//                       >
//                         View
//                       </motion.button>

//                       <motion.button
//                         whileHover={{ scale: 1.04 }}
//                         onClick={() =>
//                           downloadCSV(
//                             [
//                               {
//                                 month: selectedMonth,
//                                 [dept.department]: dept.score,
//                               },
//                             ],
//                             `${dept.department}_report_${selectedMonth}.csv`
//                           )
//                         }
//                         className="px-3 py-1 rounded-lg border text-xs bg-indigo-600 text-white"
//                       >
//                         Report
//                       </motion.button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div className="mt-4 flex items-center justify-between">
//             <div className="text-sm text-slate-500 dark:text-slate-600">
//               Last updated: <strong>September 11, 2025</strong>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setExpanded((s) => !s)}
//                 className="text-sm px-3 py-2 rounded-xl border hover:bg-slate-100 dark:hover:bg-slate-500 transition"
//               >
//                 {expanded ? "Hide Details" : "Show Details"}
//               </button>

//               <button
//                 className="text-sm px-3 py-2 rounded-xl border"
//                 onClick={() => alert("Advanced export modal (placeholder)")}
//               >
//                 Advanced Export
//               </button>

//               <button
//                 className="text-sm px-3 py-2 rounded-xl bg-indigo-600 text-white"
//                 onClick={() =>
//                   downloadCSV(
//                     [
//                       departmentPerformance.reduce(
//                         (acc, d) => ({ ...acc, [d.department]: d.score }),
//                         { month: selectedMonth }
//                       ),
//                     ],
//                     `dept_snapshot_${selectedMonth}.csv`
//                   )
//                 }
//               >
//                 Export Snapshot
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/pages/Performance.jsx
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Download, RefreshCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import * as XLSX from "xlsx";

// Mock department-wise performance data across months
const MOCK_DATA = [
  { month: "Jan", HR: 72, IT: 91, Finance: 79, Marketing: 65, Sales: 88 },
  { month: "Feb", HR: 75, IT: 86, Finance: 82, Marketing: 70, Sales: 84 },
  { month: "Mar", HR: 68, IT: 94, Finance: 77, Marketing: 69, Sales: 90 },
  { month: "Apr", HR: 78, IT: 89, Finance: 81, Marketing: 72, Sales: 85 },
  { month: "May", HR: 72, IT: 91, Finance: 79, Marketing: 65, Sales: 88 },
  { month: "Jun", HR: 74, IT: 88, Finance: 80, Marketing: 68, Sales: 87 },
  { month: "Jul", HR: 77, IT: 92, Finance: 83, Marketing: 71, Sales: 89 },
  { month: "Aug", HR: 73, IT: 90, Finance: 78, Marketing: 67, Sales: 86 },
  { month: "Sep", HR: 76, IT: 87, Finance: 82, Marketing: 70, Sales: 84 },
  { month: "Oct", HR: 79, IT: 93, Finance: 85, Marketing: 73, Sales: 91 },
];

const DEPARTMENTS = ["HR", "IT", "Finance", "Marketing", "Sales"];

// Lighter, professional palette (all same family)
const COLORS = ["#4f46e5", "#60a5fa", "#93c5fd", "#a78bfa", "#c7d2fe"];

// Small reusable stat card
function StatCard({ title, value, delta, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {title}
          </p>
          <div className="mt-1 flex items-baseline gap-3">
            <div className="text-lg font-semibold text-gray-800">{value}</div>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              {delta}
            </span>
          </div>
        </div>
        <div className="text-indigo-600">{icon}</div>
      </div>
    </motion.div>
  );
}

// Tiny sparkline
function Sparkline({ values }) {
  const width = 120;
  const height = 28;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke="#4f46e5"
        strokeWidth="2"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Excel export using SheetJS
function downloadExcel(rows, filename = "department_performance.xlsx") {
  if (!rows || !rows.length) return;
  const wb = XLSX.utils.book_new();
  // Ensure headers order is consistent
  const headers = Object.keys(rows[0]);
  const normalized = rows.map((r) =>
    headers.reduce((acc, h) => ({ ...acc, [h]: r[h] ?? "" }), {})
  );
  const ws = XLSX.utils.json_to_sheet(normalized, { header: headers });
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, filename);
}

export default function Performance() {
  const [selectedMonth, setSelectedMonth] = useState("May");
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("score");

  // derived data
  const departmentPerformance = useMemo(() => {
    const row =
      MOCK_DATA.find((r) => r.month === selectedMonth) || MOCK_DATA[0];
    return DEPARTMENTS.map((d) => ({ department: d, score: row[d] }));
  }, [selectedMonth]);

  const bestDept = useMemo(
    () => departmentPerformance.reduce((a, b) => (a.score > b.score ? a : b)),
    [departmentPerformance]
  );
  const worstDept = useMemo(
    () => departmentPerformance.reduce((a, b) => (a.score < b.score ? a : b)),
    [departmentPerformance]
  );

  const pieData = departmentPerformance.map((d, i) => ({
    name: d.department,
    value: d.score,
    color: COLORS[i],
  }));

  const tableRows = useMemo(() => {
    const filtered = departmentPerformance.filter((d) =>
      d.department.toLowerCase().includes(search.toLowerCase())
    );
    const sorted = [...filtered].sort((a, b) =>
      sortBy === "score"
        ? b.score - a.score
        : a.department.localeCompare(b.department)
    );
    return sorted;
  }, [departmentPerformance, search, sortBy]);

  const trends = useMemo(() => {
    const result = {};
    DEPARTMENTS.forEach((d) => {
      result[d] = MOCK_DATA.map((m) => m[d]);
    });
    return result;
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">
              Department Performance
            </h1>
            <p className="text-sm text-gray-600">
              Interactive dashboard — filters, exports and insights.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-xl px-3 py-2 shadow-sm border border-gray-100 bg-white text-sm text-gray-800"
            >
              {MOCK_DATA.map((m) => (
                <option key={m.month} value={m.month}>
                  {m.month}
                </option>
              ))}
            </select>

            <button
              className="px-3 py-2 rounded-xl bg-indigo-600 text-white shadow-sm flex items-center gap-2 text-sm"
              onClick={() =>
                downloadExcel(
                  MOCK_DATA.map((r) => ({ month: r.month, ...r })),
                  `performance_${selectedMonth}.xlsx`
                )
              }
            >
              <Download size={14} /> Export
            </button>
          </div>
        </header>

        {/* Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  Best:{" "}
                  <span className="font-semibold text-indigo-700">
                    {bestDept.department}
                  </span>{" "}
                  —{" "}
                  <span className="font-medium text-gray-800">
                    {bestDept.score}%
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Lowest:{" "}
                  <span className="font-semibold text-indigo-700">
                    {worstDept.department}
                  </span>{" "}
                  —{" "}
                  <span className="font-medium text-gray-800">
                    {worstDept.score}%
                  </span>
                </p>
              </div>

              <div className="w-1/3 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_DATA}>
                    <XAxis dataKey="month" hide />
                    <YAxis hide />
                    <Tooltip />
                    {DEPARTMENTS.map((d, i) => (
                      <Bar key={d} dataKey={d} stackId="a">
                        {MOCK_DATA.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[i]} />
                        ))}
                      </Bar>
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <StatCard
            title="Average Score"
            value={`${Math.round(
              departmentPerformance.reduce((a, b) => a + b.score, 0) /
                departmentPerformance.length
            )}%`}
            delta="+2%"
            icon={<ChevronDown />}
          />
          <StatCard
            title="Departments"
            value={DEPARTMENTS.length}
            delta="Stable"
            icon={<RefreshCcw />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Department Scores */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <h4 className="text-sm text-gray-600">Scores</h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={departmentPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {departmentPerformance.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Contribution Pie */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <h4 className="text-sm text-gray-600">Contribution</h4>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={80}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Trends */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <h4 className="text-sm text-gray-600">Trends</h4>
            <div className="mt-3 space-y-3">
              {DEPARTMENTS.map((d, i) => (
                <div key={d} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-6 rounded"
                      style={{ background: COLORS[i] }}
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {d}
                    </span>
                  </div>
                  <Sparkline values={trends[d]} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Expandable Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <h4 className="text-sm text-gray-600">Monthly Breakdown</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={MOCK_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      {DEPARTMENTS.map((d, idx) => (
                        <Bar key={d} dataKey={d} fill={COLORS[idx]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <h4 className="text-sm text-gray-600">Insights</h4>
                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    <li>
                      • IT leads consistently — share best practices internally.
                    </li>
                    <li>
                      • Marketing fluctuates — consider targeted training.
                    </li>
                    <li>
                      • Sales growth correlates with IT & product stability.
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 bg-white">
              <Search size={16} className="text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search departments..."
                className="px-2 py-1 text-sm outline-none bg-transparent text-gray-800"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded px-2 py-1 border border-gray-100 bg-white text-sm text-gray-800"
            >
              <option value="score">Sort by Score</option>
              <option value="department">Sort by Name</option>
            </select>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-indigo-50 text-indigo-700">
                <th className="p-2 text-left">Department</th>
                <th className="p-2">Score</th>
                <th className="p-2">Trend</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((dept, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50 transition">
                  <td className="p-2 font-medium text-gray-800">
                    {dept.department}
                  </td>

                  <td className="p-2 text-center">
                    <div className="inline-flex items-center gap-2">
                      <div className="text-sm font-semibold text-gray-800">
                        {dept.score}%
                      </div>
                      <div
                        className={`px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700`}
                      >
                        {dept.score >= 80
                          ? "Excellent"
                          : dept.score >= 70
                          ? "Good"
                          : "Needs Work"}
                      </div>
                    </div>
                  </td>

                  <td className="p-2 text-center">
                    <Sparkline values={trends[dept.department]} />
                  </td>

                  <td className="p-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        onClick={() => alert(`${dept.department} details`)}
                        className="px-3 py-1 rounded-lg border border-gray-100 text-sm bg-white text-indigo-700"
                      >
                        View
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        onClick={() =>
                          downloadExcel(
                            [
                              {
                                Month: selectedMonth,
                                Department: dept.department,
                                Score: dept.score,
                              },
                            ],
                            `${dept.department}_report_${selectedMonth}.xlsx`
                          )
                        }
                        className="px-3 py-1 rounded-lg text-sm bg-indigo-600 text-white"
                      >
                        Report
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExpanded((s) => !s)}
                className="text-sm px-3 py-2 rounded-xl border border-gray-100 hover:bg-gray-50 transition"
              >
                {expanded ? "Hide Details" : "Show Details"}
              </button>

              <button
                className="text-sm px-3 py-2 rounded-xl border border-gray-100 hover:bg-gray-50 transition"
                onClick={() => alert("Advanced export modal (placeholder)")}
              >
                Advanced Export
              </button>

              <button
                className="text-sm px-3 py-2 rounded-xl bg-indigo-600 text-white"
                onClick={() =>
                  downloadExcel(
                    [
                      departmentPerformance.reduce(
                        (acc, d) => ({ ...acc, [d.department]: d.score }),
                        { Month: selectedMonth }
                      ),
                    ],
                    `dept_snapshot_${selectedMonth}.xlsx`
                  )
                }
              >
                Export Snapshot
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
