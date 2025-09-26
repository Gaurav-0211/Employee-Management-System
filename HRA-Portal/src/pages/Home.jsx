// src/pages/Home.jsx
import { motion } from "framer-motion";
import {
  Award,
  Bell,
  Box,
  Briefcase,
  Calendar,
  ClipboardList,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  // Dummy state placeholders for API data
  const [employeeCount, setEmployeeCount] = useState(1232);
  const [pendingLeaves, setPendingLeaves] = useState(5);
  const [supportQueries, setSupportQueries] = useState([{ id: 1 }, { id: 2 }]);
  const [projects, setProjects] = useState([{ id: 1 }, { id: 2 }, { id: 3 }]);
  const [holidays, setHolidays] = useState([
    { id: 1, title: "Onam", date: "5 Sept" },
    { id: 2, title: "Dussehra", date: "2 Oct" },
    { id: 3, title: "Diwali", date: "24 Oct" },
  ]);

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

  // Chart data placeholders
  const [employeeGrowth, setEmployeeGrowth] = useState([
    { month: "Feb", employees: 905 },
    { month: "Mar", employees: 1020 },
    { month: "Apr", employees: 1090 },
    { month: "May", employees: 1150 },
    { month: "Jun", employees: 1240 },
    { month: "Jul", employees: 1310 },
    { month: "Aug", employees: 1345 },
    { month: "Sep", employees: 1400 },
  ]);

  const [attendanceData, setAttendanceData] = useState([
    { day: "Mon", present: 95, leave: 5 },
    { day: "Tue", present: 97, leave: 3 },
    { day: "Wed", present: 93, leave: 7 },
    { day: "Thu", present: 98, leave: 2 },
    { day: "Fri", present: 96, leave: 4 },
  ]);

  // Example fetch structure for future connection
  useEffect(() => {
    // Add your fetch APIs here later
  }, [user]);

  // Quick links
  const quickLinks = [
    {
      name: "Employees",
      path: "/employees",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Leaves",
      path: "/leaves",
      icon: Calendar,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      name: "Projects",
      path: "/project",
      icon: Briefcase,
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Products",
      path: "/product",
      icon: Box,
      color: "bg-purple-100 text-purple-600",
    },
    {
      name: "Support",
      path: "/support",
      icon: ClipboardList,
      color: "bg-red-100 text-red-600",
    },
    {
      name: "Holidays",
      path: "/holiday",
      icon: Calendar,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-blue-100 min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-blue-400 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-center"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome, {user?.name || "Employee"}!
          </h1>
          <p className="text-lg md:text-xl">
            Here’s a summary of your activities and important updates.
          </p>
        </div>
        <img
          src={user?.avatar || "https://avatar.iran.liara.run/public"}
          alt="avatar"
          className="w-24 h-24 rounded-full mt-4 md:mt-0"
        />
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div className="p-6 rounded-2xl shadow-lg bg-blue-500 text-white flex items-center gap-4">
          <Users size={28} />
          <div>
            <h4 className="text-lg font-semibold">Total Employees</h4>
            <p className="text-2xl font-bold">{employeeCount}</p>
          </div>
        </motion.div>

        <motion.div className="p-6 rounded-2xl shadow-lg bg-yellow-400 text-white flex items-center gap-4">
          <Calendar size={28} />
          <div>
            <h4 className="text-lg font-semibold">Pending Leaves</h4>
            <p className="text-2xl font-bold">{pendingLeaves}</p>
          </div>
        </motion.div>

        <motion.div className="p-6 rounded-2xl shadow-lg bg-green-500 text-white flex items-center gap-4">
          <Briefcase size={28} />
          <div>
            <h4 className="text-lg font-semibold">Active Projects</h4>
            <p className="text-2xl font-bold">{projects.length}</p>
          </div>
        </motion.div>

        <motion.div className="p-6 rounded-2xl shadow-lg bg-red-500 text-white flex items-center gap-4">
          <ClipboardList size={28} />
          <div>
            <h4 className="text-lg font-semibold">Support Queries</h4>
            <p className="text-2xl font-bold">{supportQueries.length}</p>
          </div>
        </motion.div>
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {quickLinks.map(({ name, path, icon: Icon, color }, idx) => (
            <Link
              key={idx}
              to={path}
              className="flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg bg-white hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div
                className={`p-4 rounded-full ${color} flex items-center justify-center`}
              >
                <Icon size={28} />
              </div>
              <span className="mt-3 font-medium">{name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Growth */}
        <motion.div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-bold mb-4">Employee Growth</h3>
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
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Attendance Trends */}
        <motion.div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-bold mb-4">Attendance Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="leave" fill="#ef4444" radius={[8, 8, 0, 0]} />
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
