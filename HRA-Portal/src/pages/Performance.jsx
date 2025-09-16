// import { AnimatePresence, motion } from "framer-motion";
// import { Download } from "lucide-react";
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

// // Mock department-wise performance data across months (for interactivity)
// const MOCK_DATA = [
//   {
//     month: "Jan",
//     HR: 72,
//     IT: 91,
//     Finance: 79,
//     Marketing: 65,
//     Sales: 88,
//   },
//   {
//     month: "Feb",
//     HR: 75,
//     IT: 86,
//     Finance: 82,
//     Marketing: 70,
//     Sales: 84,
//   },
//   {
//     month: "Mar",
//     HR: 68,
//     IT: 94,
//     Finance: 77,
//     Marketing: 69,
//     Sales: 90,
//   },
//   {
//     month: "Apr",
//     HR: 78,
//     IT: 89,
//     Finance: 81,
//     Marketing: 72,
//     Sales: 85,
//   },
//   {
//     month: "May",
//     HR: 72,
//     IT: 91,
//     Finance: 79,
//     Marketing: 65,
//     Sales: 88,
//   },
// ];

// const DEPARTMENTS = ["HR", "IT", "Finance", "Marketing", "Sales"];
// const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

// // Small reusable stat card component
// function StatCard({ title, value, delta, icon, accent = "green" }) {
//   return (
//     <div className=" bg-indigo-600 rounded-2xl p-4 shadow-sm ">
//       <div className="flex items-center justify-between gap-4">
//         <div>
//           <div className="text-sm text-gray-500 dark:text-slate-300">
//             {title}
//           </div>
//           <div className="mt-1 flex items-baseline gap-3">
//             <div className="text-2xl font-bold text-gray-900 dark:text-white">
//               {value}
//             </div>
//             <div
//               className={`text-sm font-semibold px-2 py-0.5 rounded-full bg-$
//                 {accent === "green" ? "green-100 text-green-700" : "red-100 text-red-700"}`}
//               style={{
//                 backgroundClip: "padding-box",
//               }}
//             >
//               {delta}
//             </div>
//           </div>
//         </div>
//         <div className="text-slate-400">{icon}</div>
//       </div>
//     </div>
//   );
// }

// // Tiny sparkline made with SVG for each dept
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

// // Utility: convert current filtered summary to CSV and trigger download
// function downloadCSV(rows, filename = "department_performance.csv") {
//   if (!rows || !rows.length) return;
//   const headers = Object.keys(rows[0]);
//   const csv = [headers.join(",")]
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

//   // derive current departmentPerformance for the selectedMonth
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

//   // aggregate for pie chart (contribution)
//   const pieData = departmentPerformance.map((d, i) => ({
//     name: d.department,
//     value: d.score,
//     color: COLORS[i],
//   }));

//   // table rows with search and sort
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

//   // prepare multi-month trend for each department for mini sparklines
//   const trends = useMemo(() => {
//     const result = {};
//     DEPARTMENTS.forEach((d) => {
//       result[d] = MOCK_DATA.map((m) => m[d]);
//     });
//     return result;
//   }, []);

//   return (
//     <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-white to-slate-50 dark:from-white dark:via-white dark:to-white">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <header className="flex items-center justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-600">
//               Department Performance
//             </h1>
//             <p className="text-sm text-slate-600 dark:text-orange-600">
//               Detailed interactive dashboard — month selector, filters, export
//               and trend insights.
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="flex items-center gap-2">
//               <select
//                 value={selectedMonth}
//                 onChange={(e) => setSelectedMonth(e.target.value)}
//                 className="rounded-xl hover:bg-indigo-700 bg-indigo-600 px-3 py-2 shadow-sm text-white"
//               >
//                 {MOCK_DATA.map((m) => (
//                   <option key={m.month} value={m.month}>
//                     {m.month}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 className="px-3 py-2 rounded-xl bg-indigo-600 text-white shadow hover:bg-indigo-700 flex items-center gap-2"
//                 onClick={() =>
//                   downloadCSV(
//                     MOCK_DATA.map((r) => ({ month: r.month, ...r })),
//                     `performance_${selectedMonth}.csv`
//                   )
//                 }
//               >
//                 <Download size={16} /> Export
//               </button>
//             </div>
//           </div>
//         </header>

//         {/* Top summary grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
//           <div className="lg:col-span-2 bg-white-200 from-white/80 to-indigo-50  rounded-2xl p-6 shadow-md border border-gray-100 dark:border-slate-700">
//             <div className="flex items-start justify-between gap-4">
//               <div>
//                 <h2 className="text-sm text-slate-500 dark:text-slate-600">
//                   Overview
//                 </h2>
//                 <div className="mt-2 flex items-center gap-6">
//                   <div>
//                     <div className="text-xs text-slate-600">
//                       Best Department
//                     </div>
//                     <div className="text-lg font-bold text-green-700 dark:text-green-600">
//                       {bestDept.department} — {bestDept.score}%
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-slate-600">
//                       Needs Improvement
//                     </div>
//                     <div className="text-lg font-bold text-red-600 dark:text-red-600">
//                       {worstDept.department} — {worstDept.score}%
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-4 text-sm text-slate-600 dark:text-slate-600">
//                   A snapshot of department-level performance for{" "}
//                   <strong>{selectedMonth}</strong>. Use filters and toggles to
//                   focus on departments.
//                 </div>
//               </div>

//               <div className="w-48">
//                 <ResponsiveContainer width="120%" height={120}>
//                   <BarChart
//                     data={MOCK_DATA}
//                     margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis hide />
//                     <Tooltip />
//                     {/* stacked bars representing average across departments */}
//                     {DEPARTMENTS.map((d, i) => (
//                       <Bar
//                         key={d}
//                         dataKey={d}
//                         stackId="a"
//                         radius={[6, 6, 0, 0]}
//                       >
//                         {MOCK_DATA.map((_, idx) => (
//                           <Cell
//                             key={`cell-${d}-${idx}`}
//                             fill={COLORS[i % COLORS.length]}
//                           />
//                         ))}
//                       </Bar>
//                     ))}
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
//               <StatCard
//                 title="Avg Score"
//                 value={`${Math.round(
//                   departmentPerformance.reduce((a, b) => a + b.score, 0) /
//                     departmentPerformance.length
//                 )}%`}
//                 delta="+2%"
//                 icon={
//                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
//                     <path
//                       d="M12 2v6M12 22v-6M4.9 4.9l4.2 4.2M19.1 19.1l-4.2-4.2M4.9 19.1l4.2-4.2M19.1 4.9l-4.2 4.2"
//                       stroke="#4f46e5"
//                       strokeWidth="1.2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 }
//               />

//               <StatCard
//                 title="Departments"
//                 value={DEPARTMENTS.length}
//                 delta="stable"
//                 icon={
//                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
//                     <circle
//                       cx="12"
//                       cy="12"
//                       r="9"
//                       stroke="#06b6d4"
//                       strokeWidth="1.2"
//                     />
//                   </svg>
//                 }
//               />

//               <StatCard
//                 title="Top Score"
//                 value={`${bestDept.score}%`}
//                 delta="+5%"
//                 icon={
//                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
//                     <path
//                       d="M12 3l2.5 5.1L20 9l-4 3.9.9 5.1L12 16.9 7.1 18l.9-5.1L4 9l5.5-.9L12 3z"
//                       stroke="#f59e0b"
//                       strokeWidth="0.8"
//                       fill="#f59e0b"
//                     />
//                   </svg>
//                 }
//               />
//             </div>
//           </div>

//           <div className="bg-white  rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 w-[200%]">
//             <h3 className="text-sm text-slate-500 dark:text-slate-600">
//               Department Filters
//             </h3>
//             <div className="mt-3 flex flex-wrap gap-2">
//               {DEPARTMENTS.map((d, i) => (
//                 <button
//                   key={d}
//                   onClick={() => {
//                     const next = new Set(visibleDepartments);
//                     if (next.has(d)) next.delete(d);
//                     else next.add(d);
//                     setVisibleDepartments(next);
//                   }}
//                   className={`px-3 py-1 rounded-full text-white border ${
//                     visibleDepartments.has(d)
//                       ? "bg-indigo-600 text-white border-indigo-600"
//                       : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-gray-200 dark:border-slate-700"
//                   }`}
//                 >
//                   <span
//                     className="inline-block w-2 h-2 rounded-full mr-2"
//                     style={{ background: COLORS[i] }}
//                   ></span>
//                   {d}
//                 </button>
//               ))}
//             </div>

//             <div className="mt-4  pt-4">
//               <h4 className="text-xs text-slate-600">Search / Sort</h4>
//               <div className="mt-2 flex gap-2 text-white">
//                 <input
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search department"
//                   className="flex-1 rounded-xl px-3 py-2 bg-indigo-600"
//                 />
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className="rounded-xl bg-indigo-600 px-3 py-2"
//                 >
//                   <option value="score">Sort by Score</option>
//                   <option value="department">Sort by Name</option>
//                 </select>
//               </div>
//             </div>

//             <div className="mt-4 border-t pt-4">
//               <h4 className="text-xs text-slate-600">More Actions</h4>
//               <div className="mt-2 flex gap-2">
//                 <button
//                   onClick={() => {
//                     setExpanded((s) => !s);
//                   }}
//                   className="flex-1 rounded-xl px-3 py-2 bg-indigo-600"
//                 >
//                   Toggle Details
//                 </button>
//                 <button
//                   onClick={() => {
//                     setVisibleDepartments(new Set(DEPARTMENTS));
//                   }}
//                   className="px-3 py-2 rounded-xl bg-indigo-50 bg-indigo-600"
//                 >
//                   Reset
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="lg:col-span-4">
//             {/* Main charts row */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
//               <div className="bg-white  rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
//                 <h4 className="text-sm text-slate-600">Department Scores</h4>
//                 <div className="h-64 mt-2">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart
//                       data={departmentPerformance}
//                       margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
//                     >
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="department" />
//                       <YAxis />
//                       <Tooltip />
//                       <Bar dataKey="score" radius={[8, 8, 0, 0]}>
//                         {departmentPerformance.map((_, index) => (
//                           <Cell
//                             key={`cell-${index}`}
//                             fill={COLORS[index % COLORS.length]}
//                           />
//                         ))}
//                       </Bar>
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>

//               <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
//                 <h4 className="text-sm text-slate-600">Contribution</h4>
//                 <div className="h-64 mt-2  flex items-center justify-center">
//                   <ResponsiveContainer width="100%" height={220}>
//                     <PieChart>
//                       <Pie
//                         data={pieData}
//                         cx="50%"
//                         cy="50%"
//                         outerRadius={70}
//                         dataKey="value"
//                         label={(entry) => entry.name}
//                       >
//                         {pieData.map((entry, idx) => (
//                           <Cell key={`cell-${idx}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>

//               <div className="bg-white  rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
//                 <h4 className="text-sm text-slate-500">Trends</h4>
//                 <div className="mt-3 space-y-3">
//                   {DEPARTMENTS.map((d, i) => (
//                     <div
//                       key={d}
//                       className="flex items-center justify-between gap-3"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div
//                           className="w-2 h-8 rounded"
//                           style={{ background: COLORS[i] }}
//                         ></div>
//                         <div>
//                           <div className="text-sm font-medium">{d}</div>
//                           <div className="text-xs text-slate-400">
//                             Avg:{" "}
//                             {Math.round(
//                               trends[d].reduce((a, b) => a + b, 0) /
//                                 trends[d].length
//                             )}
//                             %
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-4">
//                         <Sparkline values={trends[d]} />
//                         <div className="font-semibold">
//                           {trends[d][trends[d].length - 1]}%
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Expandable details */}
//             <AnimatePresence>
//               {expanded && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   className="overflow-hidden"
//                 >
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
//                     <div className="bg-white  rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
//                       <h4 className="text-sm text-slate-600">
//                         Monthly Breakdown
//                       </h4>
//                       <div className="mt-3 h-72">
//                         <ResponsiveContainer width="100%" height="100%">
//                           <BarChart
//                             data={MOCK_DATA}
//                             margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
//                           >
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="month" />
//                             <YAxis />
//                             <Tooltip />
//                             {DEPARTMENTS.map((d, idx) => (
//                               <Bar
//                                 key={d}
//                                 dataKey={d}
//                                 stackId="a"
//                                 fill={COLORS[idx]}
//                               />
//                             ))}
//                           </BarChart>
//                         </ResponsiveContainer>
//                       </div>
//                     </div>

//                     <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
//                       <h4 className="text-sm text-slate-500">Insights</h4>
//                       <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-600">
//                         <li>
//                           • IT consistently performs highest across months,
//                           consider sharing best practices.
//                         </li>
//                         <li>
//                           • Marketing shows more variability — training or
//                           process improvements could help.
//                         </li>
//                         <li>
//                           • HR and Finance are stable; consider cross-department
//                           mentoring programs.
//                         </li>
//                         <li>
//                           • Sales spikes correlate with months where IT &
//                           Finance are high — investigate causation.
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Table */}
//             <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 overflow-auto">
//               <div className="flex items-center justify-between mb-3">
//                 <h4 className="text-sm text-slate-600">
//                   Department Performance Details
//                 </h4>
//                 <div className="text-xs text-slate-600">
//                   Showing {tableRows.length} rows
//                 </div>
//               </div>
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-gray-50 dark:bg-slate-300 text-left">
//                     <th className="p-3 text-xs text-slate-500">Department</th>
//                     <th className="p-3 text-xs text-slate-500">Score</th>
//                     <th className="p-3 text-xs text-slate-500">Trend</th>
//                     <th className="p-3 text-xs text-slate-500">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {tableRows.map((dept, idx) => (
//                     <tr
//                       key={idx}
//                       className="border-b hover:bg-gray-50 dark:hover:bg-green-400"
//                     >
//                       <td className="p-3 font-medium">{dept.department}</td>
//                       <td className="p-3">
//                         <div className="inline-flex items-center gap-2">
//                           <div className="text-sm font-semibold">
//                             {dept.score}%
//                           </div>
//                           <div
//                             className={`px-2 py-0.5 rounded-full text-xs font-medium ${
//                               dept.score >= 80
//                                 ? "bg-green-100 text-green-700"
//                                 : dept.score >= 70
//                                 ? "bg-yellow-100 text-yellow-700"
//                                 : "bg-red-100 text-red-700"
//                             }`}
//                           >
//                             {dept.score >= 80
//                               ? "Excellent"
//                               : dept.score >= 70
//                               ? "Good"
//                               : "Needs Work"}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="p-3">
//                         <Sparkline values={trends[dept.department]} />
//                       </td>
//                       <td className="p-3">
//                         <div className="flex items-center gap-2">
//                           <button className="px-3 py-1 rounded-lg border text-sm">
//                             View
//                           </button>
//                           <button className="px-3 py-1 rounded-lg border text-sm">
//                             Report
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="mt-6 flex items-center justify-between">
//               <div className="text-sm text-slate-500">
//                 Last updated: <strong>September 11, 2025</strong>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   className="text-sm px-3 py-2 rounded-xl border"
//                   onClick={() =>
//                     alert("This would open a modal with export options.")
//                   }
//                 >
//                   Advanced Export
//                 </button>
//                 <button
//                   className="text-sm px-3 py-2 rounded-xl bg-indigo-600 text-white"
//                   onClick={() =>
//                     downloadCSV(
//                       [
//                         departmentPerformance.reduce(
//                           (acc, d) => ({ ...acc, [d.department]: d.score }),
//                           { month: selectedMonth }
//                         ),
//                       ],
//                       `dept_snapshot_${selectedMonth}.csv`
//                     )
//                   }
//                 >
//                   Export Snapshot
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <footer className="mt-10 text-center text-sm text-slate-500">
//           Built with ❤️ — interactive, responsive and theme-aware. Customize
//           colors, animations or data source as needed.
//         </footer>
//       </div>
//     </div>
//   );
// }

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Download, RefreshCcw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

// Mock department-wise performance data across months
const MOCK_DATA = [
  { month: "Jan", HR: 72, IT: 91, Finance: 79, Marketing: 65, Sales: 88 },
  { month: "Feb", HR: 75, IT: 86, Finance: 82, Marketing: 70, Sales: 84 },
  { month: "Mar", HR: 68, IT: 94, Finance: 77, Marketing: 69, Sales: 90 },
  { month: "Apr", HR: 78, IT: 89, Finance: 81, Marketing: 72, Sales: 85 },
  { month: "May", HR: 72, IT: 91, Finance: 79, Marketing: 65, Sales: 88 },
];

const DEPARTMENTS = ["HR", "IT", "Finance", "Marketing", "Sales"];
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

// Small reusable stat card
function StatCard({ title, value, delta, icon, accent = "green" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-5 shadow hover:shadow-lg transition"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="mt-1 flex items-baseline gap-3">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {value}
            </div>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                accent === "green"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {delta}
            </span>
          </div>
        </div>
        <div className="text-indigo-500 dark:text-indigo-400">{icon}</div>
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
        stroke="currentColor"
        strokeWidth="2"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-indigo-500"
      />
    </svg>
  );
}

// CSV export
function downloadCSV(rows, filename = "department_performance.csv") {
  if (!rows?.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(",")] // headers
    .concat(rows.map((r) => headers.map((h) => r[h]).join(",")))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Performance() {
  const [dark, setDark] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("May");
  const [visibleDepartments, setVisibleDepartments] = useState(
    new Set(DEPARTMENTS)
  );
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("score");

  // derived data
  const departmentPerformance = useMemo(() => {
    const row =
      MOCK_DATA.find((r) => r.month === selectedMonth) || MOCK_DATA[0];
    return DEPARTMENTS.map((d) => ({ department: d, score: row[d] }));
  }, [selectedMonth]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

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
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-white to-slate-100 dark:from-slate-900 dark:to-slate-950 transition">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              Department Performance
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Interactive dashboard with filters, exports, and insights.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-xl px-3 py-2 shadow bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              {MOCK_DATA.map((m) => (
                <option key={m.month} value={m.month}>
                  {m.month}
                </option>
              ))}
            </select>

            <button
              className="px-3 py-2 rounded-xl bg-indigo-600 text-white shadow hover:bg-indigo-700 flex items-center gap-2"
              onClick={() =>
                downloadCSV(
                  MOCK_DATA.map((r) => ({ month: r.month, ...r })),
                  `performance_${selectedMonth}.csv`
                )
              }
            >
              <Download size={16} /> Export
            </button>
          </div>
        </header>

        {/* Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Best:{" "}
                  <span className="font-bold text-green-600">
                    {bestDept.department}
                  </span>{" "}
                  — {bestDept.score}%
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Lowest:{" "}
                  <span className="font-bold text-red-600">
                    {worstDept.department}
                  </span>{" "}
                  — {worstDept.score}%
                </p>
              </div>
              <ResponsiveContainer width="40%" height={100}>
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

          <StatCard
            title="Avg Score"
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
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow"
          >
            <h4 className="text-sm text-slate-600 dark:text-slate-400">
              Scores
            </h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={departmentPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
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
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow"
          >
            <h4 className="text-sm text-slate-600 dark:text-slate-400">
              Contribution
            </h4>
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
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow"
          >
            <h4 className="text-sm text-slate-600 dark:text-slate-400">
              Trends
            </h4>
            <div className="mt-3 space-y-3">
              {DEPARTMENTS.map((d, i) => (
                <div key={d} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-6 rounded"
                      style={{ background: COLORS[i] }}
                    ></span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
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
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow">
                  <h4 className="text-sm text-slate-600 dark:text-slate-400">
                    Monthly Breakdown
                  </h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={MOCK_DATA}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      {DEPARTMENTS.map((d, idx) => (
                        <Bar key={d} dataKey={d} fill={COLORS[idx]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow">
                  <h4 className="text-sm text-slate-600 dark:text-slate-400">
                    Insights
                  </h4>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li>• IT leads consistently — share practices.</li>
                    <li>• Marketing fluctuates — training needed.</li>
                    <li>• Sales spikes correlate with IT strength.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Search size={16} className="text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="px-2 py-1 border-b outline-none bg-transparent"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded px-2 py-1 border bg-white dark:bg-slate-700"
            >
              <option value="score">Sort by Score</option>
              <option value="department">Sort by Name</option>
            </select>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700">
                <th className="p-2 text-left">Department</th>
                <th className="p-2">Score</th>
                <th className="p-2">Trend</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((dept, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  <td className="p-2 font-medium text-slate-700 dark:text-slate-200">
                    {dept.department}
                  </td>
                  <td className="p-2 text-center">
                    <div className="inline-flex items-center gap-2">
                      <div className="text-sm font-semibold">{dept.score}%</div>
                      <div
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          dept.score >= 80
                            ? "bg-green-100 text-green-700"
                            : dept.score >= 70
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
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
                        whileHover={{ scale: 1.04 }}
                        onClick={() => alert(`${dept.department} details`)}
                        className="px-3 py-1 rounded-lg border text-xs bg-white dark:bg-slate-700"
                      >
                        View
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        onClick={() =>
                          downloadCSV(
                            [
                              {
                                month: selectedMonth,
                                [dept.department]: dept.score,
                              },
                            ],
                            `${dept.department}_report_${selectedMonth}.csv`
                          )
                        }
                        className="px-3 py-1 rounded-lg border text-xs bg-indigo-600 text-white"
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
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Last updated: <strong>September 11, 2025</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setExpanded((s) => !s)}
                className="text-sm px-3 py-2 rounded-xl border hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {expanded ? "Hide Details" : "Show Details"}
              </button>

              <button
                className="text-sm px-3 py-2 rounded-xl border"
                onClick={() => alert("Advanced export modal (placeholder)")}
              >
                Advanced Export
              </button>

              <button
                className="text-sm px-3 py-2 rounded-xl bg-indigo-600 text-white"
                onClick={() =>
                  downloadCSV(
                    [
                      departmentPerformance.reduce(
                        (acc, d) => ({ ...acc, [d.department]: d.score }),
                        { month: selectedMonth }
                      ),
                    ],
                    `dept_snapshot_${selectedMonth}.csv`
                  )
                }
              >
                Export Snapshot
              </button>
            </div>
          </div>
        </div>

        <footer className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
          Built with ❤️ — interactive, responsive and theme-aware. Customize
          colors, animations or data source as needed.
        </footer>
      </div>
    </div>
  );
}
