import { useEffect, useState } from "react";
import LeaveBalance from "../components/LeaveComponent/LeaveBalance";
import LeaveHistory from "../components/LeaveComponent/LeaveHistory";
import LeaveRequest from "../components/LeaveComponent/LeaveRequest";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const LEAVE_TYPES = [
  { key: "CASUAL", label: "Casual" },
  { key: "SICK", label: "Sick" },
  { key: "EARNED", label: "Earned" },
  { key: "OTHERS", label: "Others" },
];

function prettyDateFromArray(arr) {
  if (!arr || arr.length < 3) return "-";
  const d = new Date(arr[0], arr[1] - 1, arr[2]);
  return d.toLocaleDateString();
}

function StatusBadge({ status }) {
  const s = status?.toUpperCase?.();
  const map = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };
  const cls = map[s] || "bg-gray-100 text-gray-800";
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>
      {s}
    </span>
  );
}

export default function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [approverId, setApproverId] = useState(1);

  const [selectedEmployeeHistory, setSelectedEmployeeHistory] = useState(null);
  const [employeeHistory, setEmployeeHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [balances, setBalances] = useState([]);
  const [balanceYear, setBalanceYear] = useState(new Date().getFullYear());
  const [balancesLoading, setBalancesLoading] = useState(false);

  const [rejectModal, setRejectModal] = useState({
    open: false,
    leaveId: null,
    reason: "",
  });
  const [confirmApprove, setConfirmApprove] = useState({
    open: false,
    leaveId: null,
  });

  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchEmployee, setSearchEmployee] = useState("");

  useEffect(() => {
    fetchAllLeaves();
  }, []);

  async function fetchAllLeaves() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/leave/getAll`);
      if (!res.ok) throw new Error(`Failed to fetch leaves: ${res.status}`);
      const json = await res.json();
      const data = json.data || [];
      setLeaves(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(leaveId) {
    setConfirmApprove({ open: true, leaveId });
  }

  async function doApprove() {
    const leaveId = confirmApprove.leaveId;
    setConfirmApprove({ open: false, leaveId: null });
    if (!leaveId) return;
    try {
      const url = `${API_BASE}/api/leave/approve/leave/${leaveId}/by/${approverId}`;
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) throw new Error(`Approve failed: ${res.status}`);
      const json = await res.json();
      await fetchAllLeaves();
      alert(json.message || "Leave approved");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  function openRejectModal(leaveId) {
    setRejectModal({ open: true, leaveId, reason: "" });
  }

  async function doReject() {
    const { leaveId, reason } = rejectModal;
    if (!leaveId) return;
    if (!reason) return setError("Please provide a reason for rejection");
    setRejectModal({ open: false, leaveId: null, reason: "" });
    try {
      const url = `${API_BASE}/api/leave/reject/leave/${leaveId}?approverId=${approverId}&reason=${encodeURIComponent(
        reason
      )}`;
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) throw new Error(`Reject failed: ${res.status}`);
      const json = await res.json();
      await fetchAllLeaves();
      alert(json.message || "Leave rejected");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  async function fetchHistoryForEmployee(empId) {
    if (!empId) return;
    setHistoryLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/leave/history/${empId}`);
      if (!res.ok) throw new Error(`History fetch failed: ${res.status}`);
      const json = await res.json();
      setEmployeeHistory(json.data || []);
      setSelectedEmployeeHistory(empId);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  }

  async function fetchBalancesForEmployee(empId, year) {
    if (!empId) return;
    setBalancesLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/leave/balance/${empId}/year/${year}`
      );
      if (!res.ok) throw new Error(`Balances fetch failed: ${res.status}`);
      const json = await res.json();
      setBalances(json.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setBalancesLoading(false);
    }
  }

  const filteredLeaves = leaves.filter((l) => {
    if (statusFilter && l.status?.toUpperCase() !== statusFilter.toUpperCase())
      return false;
    if (typeFilter && l.leaveType?.toUpperCase() !== typeFilter.toUpperCase())
      return false;
    if (searchEmployee && String(l.employeeId).indexOf(searchEmployee) === -1)
      return false;
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white shadow-md rounded-lg p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-600">
          Leave Management
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <label className="text-gray-600 font-medium text-sm">
              Approver ID
            </label>
            <input
              type="number"
              value={approverId}
              onChange={(e) => setApproverId(Number(e.target.value))}
              className="w-24 sm:w-28 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
              placeholder="Enter ID"
              aria-label="Approver ID"
            />
          </div>
          <button
            onClick={fetchAllLeaves}
            className="px-5 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:from-gray-700 hover:to-gray-700 hover:shadow-lg transition-all"
          >
            Refresh
          </button>
        </div>
      </header>

      <section>
        <LeaveRequest
          API_BASE={API_BASE}
          fetchAllLeaves={fetchAllLeaves}
          LEAVE_TYPES={LEAVE_TYPES}
        />
      </section>

      <section>
        <LeaveBalance API_BASE={API_BASE} LEAVE_TYPES={LEAVE_TYPES} />
      </section>

      {/* ======================= Enhanced Leaves Table ======================= */}
      <section className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 md:mb-0">
            All Leaves
          </h3>
          <div className="text-sm text-gray-500">
            {loading ? "Loading..." : `${filteredLeaves.length} results`}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm tracking-wider">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((l, index) => (
                <tr
                  key={l.id}
                  className="border-t hover:bg-indigo-50 transition-colors duration-300 cursor-pointer"
                  style={{
                    animation: `fadeInUp 0.3s ease forwards`,
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <td className="px-4 py-3">{l.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-700">
                    {l.employeeId}
                  </td>
                  <td className="px-4 py-3">{l.leaveType}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-600">
                      {prettyDateFromArray(l.startDate)} —{" "}
                      {prettyDateFromArray(l.endDate)}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-xl truncate text-gray-600">
                    {l.reason}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={l.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {l.status?.toUpperCase?.() === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleApprove(l.id)}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors duration-200"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openRejectModal(l.id)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors duration-200"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => fetchHistoryForEmployee(l.employeeId)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition-all duration-200"
                      >
                        History
                      </button>
                      <button
                        onClick={() =>
                          fetchBalancesForEmployee(l.employeeId, balanceYear)
                        }
                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition-all duration-200"
                      >
                        Balances
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fade-in animation for rows */}
        <style>
          {`
      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translateY(10px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}
        </style>
      </section>

      <section>
        <LeaveHistory
          open={!!selectedEmployeeHistory}
          onClose={() => setSelectedEmployeeHistory(null)}
          employeeId={selectedEmployeeHistory}
          loading={historyLoading}
          history={employeeHistory}
        />
      </section>

      {/* Reject modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-2">
              Reject Leave ID {rejectModal.leaveId}
            </h3>
            <textarea
              className="w-full border rounded p-2 mb-3"
              rows={4}
              placeholder="Reason for rejection"
              value={rejectModal.reason}
              onChange={(e) =>
                setRejectModal({ ...rejectModal, reason: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 border rounded"
                onClick={() =>
                  setRejectModal({ open: false, leaveId: null, reason: "" })
                }
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded"
                onClick={doReject}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve confirm modal */}
      {confirmApprove.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded p-6 w-full max-w-sm">
            <h3 className="text-lg font-medium mb-2">
              Approve Leave ID {confirmApprove.leaveId}?
            </h3>
            <div className="text-sm text-gray-600 mb-4">
              Approver ID: {approverId}
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 border rounded"
                onClick={() =>
                  setConfirmApprove({ open: false, leaveId: null })
                }
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-green-600 text-white rounded"
                onClick={doApprove}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
