import { useEffect, useState } from "react";

export default function Supports() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // New query form
  const [newQuery, setNewQuery] = useState({
    issueType: "IT",
    description: "",
    status: "OPEN",
    employeeId: "",
  });

  // Editing query modal
  const [editingQuery, setEditingQuery] = useState(null);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8081/api/supports/getAllQuery");
      const data = await res.json();
      setQueries(data.data.content || []);
    } catch (err) {
      console.error("Error fetching queries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Raise query
  const handleRaiseQuery = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:8081/api/supports/raiseQuery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuery),
      });
      setNewQuery({
        issueType: "IT",
        description: "",
        status: "OPEN",
        employeeId: "",
      });
      fetchQueries();
      showMessage("Query raised successfully!");
    } catch (err) {
      console.error("Error raising query:", err);
      showMessage("Error raising query", "error");
    }
  };

  // Delete query
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this query?")) return;
    try {
      await fetch(`http://localhost:8081/api/supports/deleteQuery/${id}`, {
        method: "DELETE",
      });
      fetchQueries();
      showMessage("Query deleted successfully!");
    } catch (err) {
      console.error("Error deleting query:", err);
      showMessage("Error deleting query", "error");
    }
  };

  // Update query
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await fetch(
        `http://localhost:8081/api/supports/updateQuery/${editingQuery.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingQuery),
        }
      );
      setEditingQuery(null);
      fetchQueries();
      showMessage("Query updated successfully!");
    } catch (err) {
      console.error("Error updating query:", err);
      showMessage("Error updating query", "error");
    }
  };

  // Resolve query
  const handleResolve = async (id) => {
    try {
      await fetch(`http://localhost:8081/api/supports/resolveQueryId/${id}`, {
        method: "POST",
      });
      fetchQueries();
      showMessage("Query resolved successfully!");
    } catch (err) {
      console.error("Error resolving query:", err);
      showMessage("Error resolving query", "error");
    }
  };

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
      <h1 className="text-4xl font-extrabold text-center text-indigo-700 drop-shadow-md">
        🛠️ Support Queries
      </h1>

      {message && (
        <div
          className={`mx-auto max-w-lg text-center py-3 rounded-lg shadow-md font-medium transition ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Raise Query */}
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-2xl mx-auto border border-indigo-100">
        <h2 className="text-xl font-semibold mb-4 text-indigo-700">
          ➕ Raise a New Query
        </h2>
        <form onSubmit={handleRaiseQuery} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Issue Type
            </label>
            <select
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              value={newQuery.issueType}
              onChange={(e) =>
                setNewQuery({ ...newQuery, issueType: e.target.value })
              }
            >
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Technical">Technical</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              value={newQuery.description}
              onChange={(e) =>
                setNewQuery({ ...newQuery, description: e.target.value })
              }
              required
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600">
                Status
              </label>
              <select
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                value={newQuery.status}
                onChange={(e) =>
                  setNewQuery({ ...newQuery, status: e.target.value })
                }
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600">
                Employee ID
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                value={newQuery.employeeId}
                onChange={(e) =>
                  setNewQuery({ ...newQuery, employeeId: e.target.value })
                }
                required
              />
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg shadow hover:scale-[1.02] transition">
            Raise Query
          </button>
        </form>
      </div>

      {/* Query List */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          📋 All Queries
        </h2>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {queries.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 border border-gray-100 transition transform hover:-translate-y-1"
              >
                <h3 className="text-lg font-bold text-indigo-600 mb-2">
                  {q.issueType}
                </h3>
                <p className="text-gray-600 mb-2 line-clamp-3">
                  {q.description}
                </p>
                <span
                  className={`inline-block px-3 py-1 text-sm rounded-full font-medium mb-2 ${
                    q.status === "OPEN"
                      ? "bg-red-100 text-red-700"
                      : q.status === "IN_PROGRESS"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {q.status}
                </span>
                <p className="text-sm text-gray-500">
                  Employee ID: {q.employeeId}
                </p>
                <p className="text-sm text-gray-400">
                  Created At: {formatDate(q.createdAt)}
                </p>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() =>
                      setEditingQuery({
                        ...q,
                        createdAt: formatDate(q.createdAt),
                      })
                    }
                    className="flex-1 bg-yellow-500 text-white py-1 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleResolve(q.id)}
                    className="flex-1 bg-green-500 text-white py-1 rounded-lg hover:bg-green-600 transition"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="flex-1 bg-red-500 text-white py-1 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Update Modal */}
      {editingQuery && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">
              ✏️ Update Query
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <select
                className="w-full p-2 border rounded-lg"
                value={editingQuery.issueType}
                onChange={(e) =>
                  setEditingQuery({
                    ...editingQuery,
                    issueType: e.target.value,
                  })
                }
              >
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Technical">Technical</option>
                <option value="Other">Other</option>
              </select>
              <textarea
                className="w-full p-2 border rounded-lg"
                value={editingQuery.description}
                onChange={(e) =>
                  setEditingQuery({
                    ...editingQuery,
                    description: e.target.value,
                  })
                }
              />
              <select
                className="w-full p-2 border rounded-lg"
                value={editingQuery.status}
                onChange={(e) =>
                  setEditingQuery({ ...editingQuery, status: e.target.value })
                }
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
              <input
                type="number"
                className="w-full p-2 border rounded-lg"
                value={editingQuery.employeeId}
                onChange={(e) =>
                  setEditingQuery({
                    ...editingQuery,
                    employeeId: e.target.value,
                  })
                }
              />
              <div className="flex space-x-4 mt-4">
                <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                  Update
                </button>
                <button
                  type="button"
                  className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
                  onClick={() => setEditingQuery(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
