import { useEffect, useState } from "react";

export default function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applyForm, setApplyForm] = useState({
    employeeId: "",
    startDate: "",
    endDate: "",
    type: "CASUAL",
    reason: "",
  });
  const [rejectReason, setRejectReason] = useState("");
  const [rejectId, setRejectId] = useState(null);

  const statusColors = {
    APPROVED: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  // Fetch Leaves
  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8081/api/leaves/getAllLeave");
      const data = await res.json();
      setLeaves(data.data.content || []);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Apply Leave
  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await fetch(
        `http://localhost:8081/api/leaves/apply/${applyForm.employeeId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startDate: applyForm.startDate,
            endDate: applyForm.endDate,
            type: applyForm.type,
            reason: applyForm.reason,
          }),
        }
      );
      setApplyForm({
        employeeId: "",
        startDate: "",
        endDate: "",
        type: "CASUAL",
        reason: "",
      });
      fetchLeaves();
      alert("Leave applied successfully!");
    } catch (err) {
      console.error("Error applying leave:", err);
    }
  };

  // Delete Leave
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this leave?")) return;
    try {
      await fetch(`http://localhost:8081/api/leaves/deleteById/${id}`, {
        method: "DELETE",
      });
      fetchLeaves();
      alert("Leave deleted successfully!");
    } catch (err) {
      console.error("Error deleting leave:", err);
    }
  };

  // Approve Leave
  const handleApprove = async (id) => {
    try {
      await fetch(`http://localhost:8081/api/leaves/approve/${id}`, {
        method: "PUT",
      });
      fetchLeaves();
      alert("Leave approved!");
    } catch (err) {
      console.error("Error approving leave:", err);
    }
  };

  // Reject Leave
  const handleReject = async (id) => {
    setRejectId(id);
  };

  const submitReject = async () => {
    try {
      await fetch(`http://localhost:8081/api/leaves/reject/${rejectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
      });
      setRejectReason("");
      setRejectId(null);
      fetchLeaves();
      alert("Leave rejected!");
    } catch (err) {
      console.error("Error rejecting leave:", err);
    }
  };

  // Helper: format date
  const formatDate = (date) => {
    if (Array.isArray(date)) {
      return `${date[0]}-${String(date[1]).padStart(2, "0")}-${String(
        date[2]
      ).padStart(2, "0")}`;
    }
    return date;
  };

  return (
    <div className="p-6 space-y-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-indigo-700">
        Leave Management
      </h1>

      {/* Apply Leave */}
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Apply for Leave</h2>
        <form onSubmit={handleApply} className="grid md:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Employee ID"
            className="p-2 border rounded"
            value={applyForm.employeeId}
            onChange={(e) =>
              setApplyForm({ ...applyForm, employeeId: e.target.value })
            }
            required
          />
          <select
            className="p-2 border rounded"
            value={applyForm.type}
            onChange={(e) =>
              setApplyForm({ ...applyForm, type: e.target.value })
            }
          >
            <option value="CASUAL">Casual</option>
            <option value="SICK">Sick</option>
            <option value="EARNED">Earned</option>
          </select>
          <input
            type="date"
            className="p-2 border rounded"
            value={applyForm.startDate}
            onChange={(e) =>
              setApplyForm({ ...applyForm, startDate: e.target.value })
            }
            required
          />
          <input
            type="date"
            className="p-2 border rounded"
            value={applyForm.endDate}
            onChange={(e) =>
              setApplyForm({ ...applyForm, endDate: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Reason"
            className="md:col-span-2 p-2 border rounded"
            value={applyForm.reason}
            onChange={(e) =>
              setApplyForm({ ...applyForm, reason: e.target.value })
            }
            required
          />
          <button className="md:col-span-2 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
            Apply Leave
          </button>
        </form>
      </div>

      {/* All Leaves */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">All Leaves</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Employee ID</th>
                  <th className="p-3">Leave Type</th>
                  <th className="p-3">From</th>
                  <th className="p-3">To</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{leave.employeeId}</td>
                    <td className="p-3">{leave.type}</td>
                    <td className="p-3">{formatDate(leave.startDate)}</td>
                    <td className="p-3">{formatDate(leave.endDate)}</td>
                    <td className="p-3">{leave.reason}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          statusColors[leave.status]
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="p-3 space-x-2">
                      {leave.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleApprove(leave.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(leave.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(leave.id)}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Reject Leave</h2>
            <textarea
              className="w-full p-2 border rounded mb-4"
              placeholder="Reason for rejection"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex space-x-4">
              <button
                onClick={submitReject}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                Submit
              </button>
              <button
                onClick={() => setRejectId(null)}
                className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
