"use client";
import { motion } from "framer-motion";
import {
  Award,
  Bell,
  Briefcase,
  Calendar,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// 🔹 Stat Card Component
function StatCard({ title, value, icon: Icon, trend, color }) {
  const isPositive = trend >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.4 }}
      className={`p-6 rounded-2xl shadow-lg text-white flex items-center gap-4`}
      style={{
        background: `linear-gradient(135deg, ${color[0]}, ${color[1]})`,
      }}
    >
      <div className="p-4 rounded-xl bg-white/20">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-2xl font-bold">{value}</p>
        <span
          className={`text-sm flex items-center gap-1 ${
            isPositive ? "text-green-100" : "text-red-100"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {trend}%
        </span>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const employeeGrowth = [
    { month: "Jan", employees: 1200 },
    { month: "Feb", employees: 1130 },
    { month: "Mar", employees: 1280 },
    { month: "Apr", employees: 1100 },
    { month: "May", employees: 1330 },
    { month: "Jun", employees: 1350 },
  ];

  const leaveData = [
    { day: "Mon", present: 1200, leave: 50 },
    { day: "Tue", present: 1220, leave: 40 },
    { day: "Wed", present: 1210, leave: 60 },
    { day: "Thu", present: 1230, leave: 30 },
    { day: "Fri", present: 1240, leave: 35 },
  ];

  const topEmployees = [
    { name: "Megha Sharma", dept: "IT", performance: "87%" },
    { name: "Priya Singh", dept: "Marketing", performance: "85%" },
    { name: "Rahul Mehta", dept: "Design", performance: "84%" },
    { name: "Sneha Verma", dept: "HR", performance: "72%" },
  ];

  const announcements = [
    { title: "Diwali Bonus Announced!", date: "Sep 1, 2025" },
    { title: "Office Renovation Completed", date: "Aug 25, 2025" },
    { title: "New Training Program: AI in HR", date: "Sep 22, 2025" },
    { title: "Independence day celebration", date: "Aug 15, 2025" },
  ];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold text-center text-blue-900 mb-8"
      >
        Employee Management Dashboard
      </motion.h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value="1,350"
          icon={Users}
          trend={5}
          color={["#2563eb", "#60a5fa"]}
        />
        <StatCard
          title="Departments"
          value="5"
          icon={Briefcase}
          trend={0}
          color={["#9333ea", "#c084fc"]}
        />
        <StatCard
          title="On Leave Today"
          value="80"
          icon={Calendar}
          trend={-3}
          color={["#ea580c", "#f97316"]}
        />
        <StatCard
          title="Open Positions"
          value="210"
          icon={UserPlus}
          trend={8}
          color={["#16a34a", "#4ade80"]}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Employee Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 rounded-2xl bg-white shadow-lg"
        >
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            Employee Growth (6 Months)
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={employeeGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="employees"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Attendance Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 rounded-2xl bg-white shadow-lg"
        >
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            Attendance Trends (This Week)
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={leaveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#16a34a" radius={[8, 8, 0, 0]} />
              <Bar dataKey="leave" fill="#dc2626" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity & Top Employees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Top Employees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 rounded-2xl bg-white shadow-lg"
        >
          <h2 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" /> Top Performing
            Employees
          </h2>
          <ul className="divide-y">
            {topEmployees.map((emp, i) => (
              <li key={i} className="py-3 flex justify-between">
                <span className="font-medium text-gray-700">
                  {emp.name} -{" "}
                  <span className="text-sm text-gray-500">{emp.dept}</span>
                </span>
                <span className="font-bold text-green-600">
                  {emp.performance}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 rounded-2xl bg-white shadow-lg"
        >
          <h2 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-500" /> Announcements
          </h2>
          <ul className="divide-y">
            {announcements.map((note, i) => (
              <li key={i} className="py-3 flex justify-between">
                <span className="font-medium text-gray-700">{note.title}</span>
                <span className="text-sm text-gray-500">{note.date}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
