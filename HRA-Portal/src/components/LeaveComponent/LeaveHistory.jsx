// src/components/LeaveHistory.jsx
import PropTypes from "prop-types";

/* Helper for date formatting */
function prettyDateFromArray(arr) {
  if (!arr || arr.length < 3) return "-";
  const d = new Date(arr[0], arr[1] - 1, arr[2]);
  return d.toLocaleDateString();
}

export default function LeaveHistory({
  open,
  onClose,
  employeeId,
  loading,
  history,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="ml-auto w-full max-w-2xl h-full bg-white shadow-xl p-6 overflow-y-auto transform transition-transform duration-300 animate-slideIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-2xl font-semibold text-gray-800">
            Leave History — Employee {employeeId}
          </h4>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200 text-xl font-bold"
            aria-label="Close history panel"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-gray-500 animate-pulse">Loading history...</div>
        ) : (
          <div className="space-y-4">
            {history.length === 0 && (
              <div className="text-sm text-gray-600">No history found.</div>
            )}

            {history.map((h) => (
              <div
                key={h.id}
                className="p-4 border rounded-xl shadow hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-sm font-medium text-gray-800">
                      {h.leaveType}
                    </span>{" "}
                    —{" "}
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded-full ${
                        h.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : h.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {h.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">ID {h.id}</div>
                </div>

                <div className="text-xs text-gray-500 mb-2">
                  {prettyDateFromArray(h.startDate)} —{" "}
                  {prettyDateFromArray(h.endDate)}
                </div>

                <div className="text-sm text-gray-700">
                  {h.reason || "No reason provided"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slide animation */}
      <style>
        {`
          @keyframes slideIn {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          .animate-slideIn {
            animation: slideIn 0.4s ease forwards;
          }
        `}
      </style>
    </div>
  );
}

LeaveHistory.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employeeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loading: PropTypes.bool,
  history: PropTypes.arrayOf(PropTypes.object),
};

LeaveHistory.defaultProps = {
  employeeId: null,
  loading: false,
  history: [],
};
