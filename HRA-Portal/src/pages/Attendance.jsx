// import { AlertCircle, CalendarCheck2, Trophy, Users } from "lucide-react";
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Legend,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

// const attendanceData = [
//   { name: "Ankit Kumar", Present: 20, Absent: 2 },
//   { name: "Shardul Sharma", Present: 22, Absent: 0 },
//   { name: "Mamta Rai", Present: 18, Absent: 4 },
//   { name: "Himesh Verma", Present: 21, Absent: 1 },
//   { name: "Mohan Singh", Present: 19, Absent: 3 },
//   { name: "Geeta Bhardwaj", Present: 22, Absent: 1 },
//   { name: "Kirti Suresh", Present: 21, Absent: 2 },
//   { name: "Narsingh Rao", Present: 18, Absent: 5 },
//   { name: "Mahesh Singh", Present: 20, Absent: 3 },
// ];

// // 🔹 Helper functions
// const totalEmployees = 1220;
// const totalPresent = attendanceData.reduce((sum, emp) => sum + emp.Present, 0);
// const totalAbsent = attendanceData.reduce((sum, emp) => sum + emp.Absent, 0);
// const avgAttendance = (totalPresent / (totalPresent + totalAbsent)) * 100;

// const bestEmployee = attendanceData.reduce(
//   (best, emp) => (emp.Present > best.Present ? emp : best),
//   attendanceData[0]
// );

// const worstEmployee = attendanceData.reduce(
//   (worst, emp) => (emp.Absent > worst.Absent ? emp : worst),
//   attendanceData[0]
// );

// export default function Attendance() {
//   return (
//     <div className="space-y-8 p-6 max-w-6xl mx-auto">
//       <h1 className="text-3xl font-bold text-indigo-700">
//         📊 Attendance Dashboard
//       </h1>

//       {/* 🔹 Summary Cards */}
//       <div className="grid md:grid-cols-4 gap-6">
//         <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
//           <Users className="w-8 h-8 text-indigo-600 mb-2" />
//           <h2 className="text-lg font-semibold">Total Employees</h2>
//           <p className="text-2xl font-bold">{totalEmployees}</p>
//         </div>

//         <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
//           <CalendarCheck2 className="w-8 h-8 text-green-600 mb-2" />
//           <h2 className="text-lg font-semibold">Avg Attendance</h2>
//           <p className="text-2xl font-bold">{avgAttendance.toFixed(1)}%</p>
//         </div>

//         <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
//           <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
//           <h2 className="text-lg font-semibold">Best Attendance</h2>
//           <p className="text-md font-medium">{bestEmployee.name}</p>
//           <p className="text-sm text-gray-600">{bestEmployee.Present} days</p>
//         </div>

//         <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
//           <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
//           <h2 className="text-lg font-semibold">Needs Improvement</h2>
//           <p className="text-md font-medium">{worstEmployee.name}</p>
//           <p className="text-sm text-gray-600">
//             {worstEmployee.Absent} absents
//           </p>
//         </div>
//       </div>

//       {/* 🔹 Attendance Chart */}
//       <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
//         <h2 className="text-xl font-semibold mb-4">
//           Employee Attendance (This Month)
//         </h2>
//         <ResponsiveContainer width="100%" height={350}>
//           <BarChart
//             data={attendanceData}
//             margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="Present" fill="#4f46e5" radius={[8, 8, 0, 0]} />
//             <Bar dataKey="Absent" fill="#f43f5e" radius={[8, 8, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* 🔹 Individual Progress */}
//       <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
//         <h2 className="text-xl font-semibold mb-4">Individual Attendance</h2>
//         <div className="space-y-4">
//           {attendanceData.map((emp, i) => {
//             const total = emp.Present + emp.Absent;
//             const percentage = (emp.Present / total) * 100;
//             return (
//               <div key={i}>
//                 <div className="flex justify-between mb-1">
//                   <span className="font-medium">{emp.name}</span>
//                   <span className="text-sm text-gray-600">
//                     {percentage.toFixed(1)}%
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 h-3 rounded-full">
//                   <div
//                     className="h-3 rounded-full bg-indigo-600 transition-all"
//                     style={{ width: `${percentage}%` }}
//                   ></div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

import { AlertCircle, CalendarCheck2, Trophy, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const attendanceData = [
  { name: "Ankit Kumar", Present: 20, Absent: 2 },
  { name: "Shardul Sharma", Present: 22, Absent: 0 },
  { name: "Mamta Rai", Present: 18, Absent: 4 },
  { name: "Himesh Verma", Present: 21, Absent: 1 },
  { name: "Mohan Singh", Present: 19, Absent: 3 },
  { name: "Geeta Bhardwaj", Present: 22, Absent: 1 },
  { name: "Kirti Suresh", Present: 21, Absent: 2 },
  { name: "Narsingh Rao", Present: 18, Absent: 5 },
  { name: "Mahesh Singh", Present: 20, Absent: 3 },
];

// Calculations
const totalEmployees = 1220;
const totalPresent = attendanceData.reduce((sum, emp) => sum + emp.Present, 0);
const totalAbsent = attendanceData.reduce((sum, emp) => sum + emp.Absent, 0);
const avgAttendance = (totalPresent / (totalPresent + totalAbsent)) * 100;

const bestEmployee = attendanceData.reduce(
  (best, emp) => (emp.Present > best.Present ? emp : best),
  attendanceData[0]
);

const worstEmployee = attendanceData.reduce(
  (worst, emp) => (emp.Absent > worst.Absent ? emp : worst),
  attendanceData[0]
);

// Lighter Indigo Palette
const LIGHT_INDIGO = "#6366f1";
const LIGHT_INDIGO_SOFT = "#e0e7ff";
const GRAY_TEXT = "text-gray-700";

export default function Attendance() {
  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-indigo-700 tracking-tight">
        Attendance Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          {
            icon: <Users className="w-6 h-6 text-indigo-600" />,
            title: "Total Employees",
            value: totalEmployees,
          },
          {
            icon: <CalendarCheck2 className="w-6 h-6 text-indigo-600" />,
            title: "Average Attendance",
            value: `${avgAttendance.toFixed(1)}%`,
          },
          {
            icon: <Trophy className="w-6 h-6 text-indigo-600" />,
            title: "Best Attendance",
            value: bestEmployee.name,
            sub: `${bestEmployee.Present} days`,
          },
          {
            icon: <AlertCircle className="w-6 h-6 text-indigo-600" />,
            title: "Needs Improvement",
            value: worstEmployee.name,
            sub: `${worstEmployee.Absent} absents`,
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
          >
            <div>{card.icon}</div>
            <h2 className="text-sm font-medium mt-3 text-gray-600">
              {card.title}
            </h2>
            <p className="text-xl font-semibold mt-1 text-gray-800">
              {card.value}
            </p>
            {card.sub && <p className="text-sm text-gray-500">{card.sub}</p>}
          </div>
        ))}
      </div>

      {/* Attendance Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-medium mb-4 text-gray-800">
          Employee Attendance (This Month)
        </h2>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={attendanceData}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Soft professional tones */}
            <Bar dataKey="Present" fill={LIGHT_INDIGO} radius={[6, 6, 0, 0]} />
            <Bar dataKey="Absent" fill="#a5b4fc" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Individual Progress */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-medium mb-4 text-gray-800">
          Individual Attendance
        </h2>

        <div className="space-y-4">
          {attendanceData.map((emp, i) => {
            const total = emp.Present + emp.Absent;
            const percentage = (emp.Present / total) * 100;

            return (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-700">{emp.name}</span>
                  <span className="text-sm text-gray-500">
                    {percentage.toFixed(1)}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 h-3 rounded-full">
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      background: LIGHT_INDIGO,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
