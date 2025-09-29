// src/components/LeaveComponent/LeaveRequest.jsx
import { useState } from "react";

const isoFromDateInput = (dateStr) => {
  return new Date(dateStr).toISOString().split("T")[0];
};

export default function LeaveRequest({
  API_BASE,
  fetchAllLeaves,
  LEAVE_TYPES,
}) {
  const [form, setForm] = useState({
    employeeId: "",
    leaveType: "CASUAL",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [error, setError] = useState(null);

  const requestLeave = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation for required fields
    if (!form.employeeId) return setError("Employee ID is required");
    if (!form.startDate || !form.endDate)
      return setError("Start and end dates are required");
    if (new Date(form.startDate) > new Date(form.endDate))
      return setError("Start date cannot be after end date");

    const payload = {
      employeeId: Number(form.employeeId),
      leaveType: form.leaveType,
      startDate: isoFromDateInput(form.startDate),
      endDate: isoFromDateInput(form.endDate),
      reason: form.reason,
    };

    try {
      const res = await fetch(`${API_BASE}/api/leave/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Failed to create leave: ${res.status}`);

      const json = await res.json();
      await fetchAllLeaves();

      setForm({
        employeeId: "",
        leaveType: "CASUAL",
        startDate: "",
        endDate: "",
        reason: "",
      });

      alert(json.message || "Leave requested successfully ✅");
    } catch (err) {
      console.error(err);
      setError(err.message || "Unknown error");
    }
  };

  return (
    <section className="mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
          Create Leave Request
        </h2>

        {error && (
          <div className="mb-3 text-red-600 animate-pulse">{error}</div>
        )}

        <form onSubmit={requestLeave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Employee ID
              </label>
              <input
                type="number"
                value={form.employeeId}
                onChange={(e) =>
                  setForm({ ...form, employeeId: e.target.value })
                }
                required
                className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 transition-all"
                placeholder="Enter ID"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Leave Type
              </label>
              <select
                value={form.leaveType}
                onChange={(e) =>
                  setForm({ ...form, leaveType: e.target.value })
                }
                className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 transition-all"
              >
                {LEAVE_TYPES.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Reason (optional)
              </label>
              <input
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 transition-all"
                placeholder="Optional reason"
              />
            </div>
          </div>

          {/* Dates & Submit */}
          <div className="flex flex-col md:flex-row items-end gap-4 mt-2">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                required
                className="mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                required
                className="mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 transition-all"
              />
            </div>

            <div className="ml-auto">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-semibold rounded-lg shadow-md hover:from-indigo-800 hover:to-indigo-600 hover:shadow-lg transition-all duration-300"
              >
                Request Leave
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
