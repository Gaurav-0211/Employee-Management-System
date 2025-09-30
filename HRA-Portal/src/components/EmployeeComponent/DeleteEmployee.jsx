import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function DeleteEmployee() {
  const [employeeId, setEmployeeId] = useState("");
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!employeeId || isNaN(employeeId)) {
      setStatus("error");
      setMessage("Please enter a valid numeric Employee ID.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.delete(
        `${API_BASE}/api/employees/delete/${employeeId}`
      );

      if (res.status === 200) {
        setStatus("success");
        setMessage(`Employee with ID ${employeeId} deleted successfully.`);
      } else {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      if (err.response && err.response.status === 404) {
        setMessage(`Employee with ID ${employeeId} does not exist.`);
      } else {
        setMessage("Error deleting employee. Please try again.");
      }
    } finally {
      setLoading(false);
      setEmployeeId("");
    }
  };

  return (
    <div className=" w-full min-h-screen ">
      <motion.div
        className="w-full bg-white rounded-2xl shadow-lg p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Delete Employee
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="Enter Employee ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <button
            onClick={handleDelete}
            disabled={loading}
            className={`w-[20%] py-2 rounded-xl font-medium text-white transition-all ${
              loading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {loading ? "Deleting..." : "Delete Employee"}
          </button>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 text-center px-3 py-2 rounded-xl text-sm font-medium ${
                status === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
