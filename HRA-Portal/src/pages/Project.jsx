import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function ProjectPage() {
  const baseUrl = "http://localhost:8081/api/projects";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Create project form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "In Progress",
  });
  const [creating, setCreating] = useState(false);

  // Assign employee state
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [assignEmployeeId, setAssignEmployeeId] = useState("");
  const [assignResponse, setAssignResponse] = useState(null);
  const [assigning, setAssigning] = useState(false);

  // Update project form state
  const [updateForm, setUpdateForm] = useState({
    id: "",
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "In Progress",
  });
  const [updating, setUpdating] = useState(false);

  // Pagination
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadProjects();
  }, [pageNumber]);

  async function loadProjects() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${baseUrl}/getAll?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      if (!res.ok) throw new Error(`Failed to fetch projects (${res.status})`);
      const json = await res.json();
      const content = json?.data?.content ?? [];
      setProjects(content);
      setTotalPages(json?.data?.totalPage ?? 1);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function handleFormChange(e, setState) {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCreateProject(e) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      if (!form.name || !form.startDate || !form.endDate) {
        setError("Please provide project name, start and end dates.");
        setCreating(false);
        return;
      }
      const payload = { ...form };
      const res = await fetch(`${baseUrl}/createProject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Create failed (${res.status})`);
      await res.json();
      await loadProjects();
      setForm({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "In Progress",
      });
    } catch (err) {
      setError(err.message || "Create error");
    } finally {
      setCreating(false);
    }
  }

  async function handleAssign(e) {
    e.preventDefault();
    if (!selectedProjectId || !assignEmployeeId) {
      setError("Please choose a project and enter employee id.");
      return;
    }
    setAssigning(true);
    setAssignResponse(null);
    setError(null);
    try {
      const url = `${baseUrl}/${selectedProjectId}/assign-employee/${assignEmployeeId}`;
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) throw new Error(`Assign failed (${res.status})`);
      const json = await res.json();
      setAssignResponse(json);
      await loadProjects();
      setAssignEmployeeId("");
      setSelectedProjectId("");
    } catch (err) {
      setError(err.message || "Assign error");
    } finally {
      setAssigning(false);
    }
  }

  async function handleDeleteProject(id) {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      const res = await fetch(`${baseUrl}/deleteProject/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      await loadProjects();
    } catch (err) {
      setError(err.message || "Delete error");
    }
  }

  async function handleUpdateProject(e) {
    e.preventDefault();
    if (!updateForm.id) {
      setError("Please select a project ID to update.");
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`${baseUrl}/updateProject/${updateForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updateForm.name,
          description: updateForm.description,
          startDate: updateForm.startDate,
          endDate: updateForm.endDate,
          status: updateForm.status,
        }),
      });
      if (!res.ok) throw new Error(`Update failed (${res.status})`);
      await res.json();
      await loadProjects();
      setUpdateForm({
        id: "",
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "In Progress",
      });
    } catch (err) {
      setError(err.message || "Update error");
    } finally {
      setUpdating(false);
    }
  }

  function dateArrayToString(arr) {
    if (!Array.isArray(arr)) return "";
    const [y, m, d] = arr;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  return (
    <div className="p-6 sm:p-10 bg-gradient-to-br from-indigo-50 to-white min-h-screen space-y-10">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center text-indigo-700"
      >
        Project Management
      </motion.h2>

      {error && (
        <div className="text-red-600 text-center font-medium">{error}</div>
      )}

      {/* Project List */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-semibold mb-6 border-b pb-2">
          All Projects
        </h3>
        {loading ? (
          <p>Loading projects...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <motion.div
                key={proj.id}
                whileHover={{ scale: 1.02 }}
                className="p-5 rounded-xl bg-gradient-to-br from-white to-indigo-50 border border-gray-200 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-lg font-semibold text-indigo-700">
                    {proj.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {proj.description || "-"}
                  </p>
                  <div className="mt-3 text-sm text-gray-500">
                    <div>
                      Status:{" "}
                      <span className="font-medium text-indigo-600">
                        {proj.status}
                      </span>
                    </div>
                    <div>
                      {dateArrayToString(proj.startDate)} →{" "}
                      {dateArrayToString(proj.endDate)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <a
                    href="#update"
                    className="px-3 py-1 rounded-lg bg-yellow-500 text-white text-sm hover:bg-yellow-600"
                  >
                    Update
                  </a>
                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm">
            Page {pageNumber + 1} / {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              disabled={pageNumber <= 0}
              onClick={() => setPageNumber((p) => Math.max(0, p - 1))}
            >
              Prev
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              disabled={pageNumber + 1 >= totalPages}
              onClick={() =>
                setPageNumber((p) => Math.min(totalPages - 1, p + 1))
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Create Project */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">
          Create Project
        </h3>
        <form onSubmit={handleCreateProject} className="space-y-4">
          <input
            name="name"
            placeholder="Project Name"
            value={form.name}
            onChange={(e) => handleFormChange(e, setForm)}
            className="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-200"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={(e) => handleFormChange(e, setForm)}
            className="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-200"
            rows={3}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={(e) => handleFormChange(e, setForm)}
              className="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-200"
            />
            <input
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={(e) => handleFormChange(e, setForm)}
              className="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-200"
            />
          </div>
          <select
            name="status"
            value={form.status}
            onChange={(e) => handleFormChange(e, setForm)}
            className="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-200"
          >
            <option>In Progress</option>
            <option>Planned</option>
            <option>Completed</option>
            <option>On Hold</option>
          </select>
          <button
            type="submit"
            className="w-full px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
            disabled={creating}
          >
            {creating ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>

      {/* Assign Employee */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">
          Assign Employee to Project
        </h3>
        <form onSubmit={handleAssign} className="space-y-4">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-200"
          >
            <option value="">Choose a project</option>
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
          </select>
          <input
            placeholder="Employee ID"
            value={assignEmployeeId}
            onChange={(e) => setAssignEmployeeId(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-200"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            disabled={assigning}
          >
            {assigning ? "Assigning..." : "Assign Employee"}
          </button>
        </form>
        {assignResponse && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm border">
            <div className="font-medium text-indigo-600">Assigned Employee</div>
            <div>Name: {assignResponse?.data?.name}</div>
            <div>Email: {assignResponse?.data?.email}</div>
            <div>Contact: {assignResponse?.data?.contactNumber}</div>
            <div>Projects: {(assignResponse?.data?.projects || []).length}</div>
          </div>
        )}
      </div>

      {/* Update Project */}
      <div id="update" className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">
          Update Project
        </h3>
        <form onSubmit={handleUpdateProject} className="space-y-4">
          <input
            name="id"
            placeholder="Project ID"
            value={updateForm.id}
            onChange={(e) => handleFormChange(e, setUpdateForm)}
            className="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-200"
          />
          <input
            name="name"
            placeholder="Project Name"
            value={updateForm.name}
            onChange={(e) => handleFormChange(e, setUpdateForm)}
            className="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-200"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={updateForm.description}
            onChange={(e) => handleFormChange(e, setUpdateForm)}
            className="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-200"
            rows={3}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              name="startDate"
              type="date"
              value={updateForm.startDate}
              onChange={(e) => handleFormChange(e, setUpdateForm)}
              className="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-200"
            />
            <input
              name="endDate"
              type="date"
              value={updateForm.endDate}
              onChange={(e) => handleFormChange(e, setUpdateForm)}
              className="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-200"
            />
          </div>
          <select
            name="status"
            value={updateForm.status}
            onChange={(e) => handleFormChange(e, setUpdateForm)}
            className="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-200"
          >
            <option>In Progress</option>
            <option>Planned</option>
            <option>Completed</option>
            <option>On Hold</option>
          </select>
          <button
            type="submit"
            className="w-full px-4 py-2 rounded-lg bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition"
            disabled={updating}
          >
            {updating ? "Updating..." : "Update Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
