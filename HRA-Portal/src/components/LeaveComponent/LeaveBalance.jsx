// src/components/LeaveBalance.jsx
import { useState } from "react";

export default function LeaveBalance({ API_BASE }) {
  const [showBalances, setShowBalances] = useState(false);
  const [balanceYear, setBalanceYear] = useState(new Date().getFullYear());
  const [balances, setBalances] = useState([]);
  const [balancesLoading, setBalancesLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchBalancesForEmployee(empId, year) {
    if (!empId) return;
    setBalancesLoading(true);
    setError(null);

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

  return (
    <section className="mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Leave Balances
        </h3>

        {/* Collapsible Balances */}
        <div className="border-t pt-4">
          <h4
            className="text-lg font-medium cursor-pointer flex justify-between items-center"
            onClick={() => setShowBalances(!showBalances)}
          >
            View Balances
            <span
              className={`transform transition-transform ${
                showBalances ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </h4>

          {showBalances && (
            <div className="mt-3 space-y-3 animate-fadeIn">
              {/* Inputs */}
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Employee ID"
                  className="border border-gray-300 rounded-lg p-2 flex-1 focus:ring-2 focus:ring-indigo-400 transition-all"
                  id="balance-emp"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const emp = e.target.value;
                      if (emp) fetchBalancesForEmployee(emp, balanceYear);
                    }
                  }}
                />
                <input
                  type="number"
                  value={balanceYear}
                  onChange={(e) => setBalanceYear(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg p-2 w-28 focus:ring-2 focus:ring-indigo-400 transition-all"
                />
                <button
                  onClick={() => {
                    const emp = document.getElementById("balance-emp").value;
                    if (!emp)
                      return setError("Enter employee id to fetch balances");
                    fetchBalancesForEmployee(emp, balanceYear);
                  }}
                  className="px-3 py-1 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-lg shadow hover:from-slate-900 hover:to-slate-700 transition-all"
                >
                  Fetch
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="text-sm text-red-600 animate-pulse">
                  {error}
                </div>
              )}

              {/* Loading */}
              {balancesLoading && (
                <div className="text-sm text-gray-500">Loading balances...</div>
              )}

              {/* Results */}
              {balances.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {balances.map((b) => (
                    <li
                      key={`${b.employeeId}-${b.leaveType}`}
                      className="flex justify-between text-sm p-2 border rounded hover:bg-gray-50 transition-all"
                    >
                      <span className="text-gray-700">{b.leaveType}</span>
                      <span className="font-semibold text-gray-800">
                        {b.balance}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
