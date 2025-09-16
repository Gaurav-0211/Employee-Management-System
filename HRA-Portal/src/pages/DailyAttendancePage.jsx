// DailyAttendancePage.jsx
// React single-file component (Tailwind CSS + Recharts + Axios)
// Dependencies: axios, date-fns, recharts
// Usage: Place this component in /src/pages/DailyAttendancePage.jsx and import it into your router.

import axios from "axios";
import { format, parseISO } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
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

// Configuration
const CONFIG = {
  BIOMETRIC_ENDPOINT: "/api/biometric/daily",
  EMPLOYEES_ENDPOINT: "/api/employees",
  SHIFT_START: "09:30",
  SHIFT_END: "18:30",
  LATE_TOLERANCE_MINUTES: 5,
  EARLY_LEAVE_TOLERANCE_MINUTES: 5,
  WS_URL: null,
};

// Utility functions
function timeToDate(dateStr, hhmm) {
  const [yyyy, mm, dd] = dateStr.split("-");
  const [h, m] = hhmm.split(":");
  return new Date(
    Number(yyyy),
    Number(mm) - 1,
    Number(dd),
    Number(h),
    Number(m)
  );
}

function parsePunchTime(s) {
  try {
    return parseISO(s);
  } catch {
    return new Date(s);
  }
}

function minutesDifference(a, b) {
  return Math.round((a - b) / 60000);
}

function computeAttendanceStatus({ firstIn, lastOut, date }) {
  if (!firstIn && !lastOut) return { status: "absent", reason: "No punches" };

  const shiftStart = timeToDate(date, CONFIG.SHIFT_START);
  const shiftEnd = timeToDate(date, CONFIG.SHIFT_END);

  let status = "on-time";
  let reasons = [];

  if (firstIn) {
    const diff = minutesDifference(firstIn, shiftStart);
    if (diff > CONFIG.LATE_TOLERANCE_MINUTES && diff <= 15) {
      status = "minor-late";
      reasons.push(`Late by ${diff} min`);
    } else if (diff > 15) {
      status = "late";
      reasons.push(`Late by ${diff} min`);
    }
  }

  if (lastOut) {
    const diffOut = minutesDifference(shiftEnd, lastOut);
    if (diffOut > CONFIG.EARLY_LEAVE_TOLERANCE_MINUTES) {
      if (status === "late" || status === "minor-late") status = "late";
      else status = "early-leave";
      reasons.push(`Left early by ${diffOut} min`);
    }
  }

  return { status, reason: reasons.join("; ") };
}

function statusToClass(status) {
  switch (status) {
    case "on-time":
      return "bg-emerald-100 text-emerald-800";
    case "minor-late":
      return "bg-orange-100 text-orange-800";
    case "late":
      return "bg-red-100 text-red-800";
    case "early-leave":
      return "bg-amber-100 text-amber-800";
    case "absent":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function exportToCSV(filename, rows) {
  if (!rows || !rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(","),
    ...rows.map((r) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DailyAttendancePage() {
  const todayISO = format(new Date(), "yyyy-MM-dd");
  const [date, setDate] = useState(todayISO);
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 25;
  const wsRef = useRef(null);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await axios.get(CONFIG.EMPLOYEES_ENDPOINT);
        setEmployees(res.data);
      } catch (e) {
        console.warn("Could not fetch employees metadata: ", e.message);
      }
    }
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchAttendance(date);
  }, [date]);

  useEffect(() => {
    if (!CONFIG.WS_URL) return;
    const ws = new WebSocket(CONFIG.WS_URL);
    wsRef.current = ws;
    ws.onmessage = () => fetchAttendance(date);
    return () => ws.close();
  }, [date]);

  async function fetchAttendance(fetchDate) {
    setLoading(true);
    try {
      const res = await axios.get(CONFIG.BIOMETRIC_ENDPOINT, {
        params: { date: fetchDate },
      });
      const raw = res.data;
      const enriched = raw.map((r) => {
        const punches = (r.punches || []).map((p) => ({
          ...p,
          timeObj: parsePunchTime(p.time),
        }));
        const firstIn =
          punches
            .filter((p) => p.type === "IN")
            .sort((a, b) => a.timeObj - b.timeObj)[0]?.timeObj || null;
        const lastOut =
          punches
            .filter((p) => p.type === "OUT")
            .sort((a, b) => a.timeObj - b.timeObj)
            .slice(-1)[0]?.timeObj || null;
        const computed = computeAttendanceStatus({
          firstIn,
          lastOut,
          date: fetchDate,
        });
        return {
          employeeId: r.employeeId || r.id,
          name: r.name || "Unknown",
          department: r.department || "—",
          punches,
          firstIn,
          lastOut,
          computedStatus: computed.status,
          computedReason: computed.reason,
        };
      });

      if (employees.length) {
        const byId = new Map(enriched.map((e) => [String(e.employeeId), e]));
        const all = employees.map((emp) => {
          if (byId.has(String(emp.id))) return byId.get(String(emp.id));
          return {
            employeeId: emp.id,
            name: `${emp.firstName || ""} ${emp.lastName || ""}`.trim(),
            department: emp.department || "—",
            punches: [],
            firstIn: null,
            lastOut: null,
            computedStatus: "absent",
            computedReason: "No punches",
          };
        });
        setAttendance(all);
      } else {
        setAttendance(enriched);
      }
    } catch (e) {
      console.error("Failed to fetch attendance", e);
      setAttendance([]);
    }
    setLoading(false);
  }

  const filtered = useMemo(() => {
    let arr = [...attendance];
    if (filterStatus !== "all")
      arr = arr.filter((a) => a.computedStatus === filterStatus);
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter((a) =>
        `${a.name} ${a.employeeId} ${a.department}`.toLowerCase().includes(q)
      );
    }
    return arr;
  }, [attendance, filterStatus, query]);

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const stats = useMemo(() => {
    const total = attendance.length;
    const absent = attendance.filter(
      (a) => a.computedStatus === "absent"
    ).length;
    const late = attendance.filter(
      (a) => a.computedStatus === "late" || a.computedStatus === "minor-late"
    ).length;
    const early = attendance.filter(
      (a) => a.computedStatus === "early-leave"
    ).length;
    const present = total - absent;
    return { total, present, absent, late, early };
  }, [attendance]);

  const chartData = useMemo(() => {
    const counts = {
      "on-time": 0,
      "minor-late": 0,
      late: 0,
      "early-leave": 0,
      absent: 0,
    };
    attendance.forEach(
      (a) => (counts[a.computedStatus] = (counts[a.computedStatus] || 0) + 1)
    );
    return Object.keys(counts).map((k) => ({ name: k, value: counts[k] }));
  }, [attendance]);

  function exportLateList() {
    exportToCSV(
      `late-list-${date}.csv`,
      attendance
        .filter((a) => ["late", "minor-late"].includes(a.computedStatus))
        .map((a) => ({
          id: a.employeeId,
          name: a.name,
          department: a.department,
          reason: a.computedReason,
        }))
    );
  }

  function exportOnTimeList() {
    exportToCSV(
      `on-time-list-${date}.csv`,
      attendance
        .filter((a) => a.computedStatus === "on-time")
        .map((a) => ({
          id: a.employeeId,
          name: a.name,
          department: a.department,
        }))
    );
  }

  function formatTimeSafe(d) {
    if (!d) return "—";
    try {
      return format(d, "HH:mm");
    } catch {
      return String(d);
    }
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Daily Attendance</h1>
          <p className="text-sm text-gray-500">
            Date: <strong>{date}</strong> — Shift {CONFIG.SHIFT_START} to{" "}
            {CONFIG.SHIFT_END}
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={() => fetchAttendance(date)}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Refresh
          </button>
          <button
            onClick={exportLateList}
            className="px-3 py-2 bg-red-600 text-white rounded"
          >
            Export Late
          </button>
          <button
            onClick={exportOnTimeList}
            className="px-3 py-2 bg-emerald-600 text-white rounded"
          >
            Export On-Time
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Total employees</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Present</div>
          <div className="text-2xl font-bold">{stats.present}</div>
        </div>
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Late</div>
          <div className="text-2xl font-bold">{stats.late}</div>
        </div>
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Absent</div>
          <div className="text-2xl font-bold">{stats.absent}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <input
          className="border px-2 py-1 rounded"
          placeholder="Search by name/ID/department"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All statuses</option>
          <option value="on-time">On-time</option>
          <option value="minor-late">Minor Late</option>
          <option value="late">Late</option>
          <option value="early-leave">Early Leave</option>
          <option value="absent">Absent</option>
        </select>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Department</th>
              <th className="px-3 py-2 text-left">First In</th>
              <th className="px-3 py-2 text-left">Last Out</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paged.map((r) => (
              <tr key={r.employeeId} className="hover:bg-gray-50">
                <td className="px-3 py-2">{r.employeeId}</td>
                <td className="px-3 py-2 font-medium">{r.name}</td>
                <td className="px-3 py-2">{r.department}</td>
                <td className="px-3 py-2">{formatTimeSafe(r.firstIn)}</td>
                <td className="px-3 py-2">{formatTimeSafe(r.lastOut)}</td>
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${statusToClass(
                      r.computedStatus
                    )}`}
                  >
                    {r.computedStatus}
                  </span>
                </td>
                <td className="px-3 py-2">{r.computedReason || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          disabled={page * PAGE_SIZE >= filtered.length}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Chart */}
      <div className="mt-6 p-4 border rounded">
        <h2 className="text-lg font-bold mb-2">Attendance Summary</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3182ce" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
