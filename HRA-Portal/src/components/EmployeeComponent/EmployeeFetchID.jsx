import axios from "axios";
import { motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  ClipboardList,
  Mail,
  MapPin,
  Package,
  Phone,
  User,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const roles = [
  { id: 1, name: "CEO" },
  { id: 2, name: "CTO" },
  { id: 3, name: "CFO" },
  { id: 4, name: "COO" },
  { id: 5, name: "Manager" },
  { id: 6, name: "Team Leader" },
  { id: 7, name: "Developers" },
  { id: 8, name: "Analyst" },
  { id: 9, name: "Trainee" },
];

const departments = [
  { id: 1, name: "Finance" },
  { id: 2, name: "IT" },
  { id: 3, name: "Sales" },
  { id: 4, name: "Forex" },
  { id: 5, name: "Travel" },
  { id: 6, name: "Insurance" },
];

const employeeRoles = [
  { id: 1, name: "SUPER_ADMIN" },
  { id: 2, name: "ADMIN" },
  { id: 3, name: "USER" },
  { id: 4, name: "NORMAL" },
];

export default function EmployeeFetchID() {
  const [empId, setEmpId] = useState("");
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const empIdRef = useRef(null);
  const firstInputRef = useRef(null);

  const [showEdit, setShowEdit] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [updateStatus, setUpdateStatus] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    address: "",
    roleId: "",
    departmentId: "",
    employeeRoleId: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchEmployee = () => {
    if (!empId.trim()) {
      setError("⚠ Please enter a valid Employee ID.");
      return;
    }

    setLoading(true);
    setError("");
    setEmployee(null);

    axios
      .get(`${API_BASE}/api/employees/getEmployee/${empId}`)
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setEmployee(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setError(`❌ Employee with ID ${empId} not found.`);
        } else {
          setError("❌ Failed to fetch employee details.");
        }
        setLoading(false);
      });
  };

  const Badge = ({ text, color }) => (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${color}`}
    >
      {text}
    </span>
  );

  const Card = ({ children, className = "" }) => (
    <div
      className={`bg-white/70 backdrop-blur-md border border-gray-200 shadow-lg rounded-xl p-5 transition hover:shadow-2xl ${className}`}
    >
      {children}
    </div>
  );

  const CardContent = ({ children }) => <div>{children}</div>;

  const Button = ({ children, onClick, className = "", ...rest }) => (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`px-5 py-2 mt-[1rem] bg-gradient-to-r from-gray-600 to-gray-600 text-white font-semibold rounded-lg shadow hover:from-gray-700 hover:to-gray-700 transition ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );

  const TextInput = React.forwardRef(({ className, ...props }, ref) => (
    <input
      ref={ref}
      {...props}
      type="text"
      className={`border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
        className || ""
      }`}
    />
  ));
  TextInput.displayName = "TextInput";

  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-5 h-5 text-blue-600" />
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    </div>
  );

  // Helpers to map existing employee data to option ids
  const findRoleIdFromEmployee = (emp) => {
    if (!emp) return "";
    if (emp.role && (emp.role.id || emp.role.roleName)) {
      if (emp.role.id) return emp.role.id;
      const match = roles.find(
        (r) =>
          r.name.toLowerCase() ===
          String(emp.role.roleName || emp.role).toLowerCase()
      );
      return match?.id ?? "";
    }
    if (emp.roleId) return emp.roleId;
    return "";
  };

  const findDepartmentIdFromEmployee = (emp) => {
    if (!emp) return "";
    if (emp.department && (emp.department.id || emp.department.name)) {
      if (emp.department.id) return emp.department.id;
      const match = departments.find(
        (d) =>
          d.name.toLowerCase() ===
          String(emp.department.name || emp.department).toLowerCase()
      );
      return match?.id ?? "";
    }
    if (emp.departmentId) return emp.departmentId;
    return "";
  };

  const findEmployeeRoleIdFromEmployee = (emp) => {
    if (!emp) return "";
    // common shapes: emp.employeeRole { id, name } OR emp.employeeRoleId OR emp.role?.name
    if (emp.employeeRole && (emp.employeeRole.id || emp.employeeRole.name)) {
      if (emp.employeeRole.id) return emp.employeeRole.id;
      const match = employeeRoles.find(
        (er) =>
          er.name.toLowerCase() ===
          String(emp.employeeRole.name || emp.employeeRole).toLowerCase()
      );
      return match?.id ?? "";
    }
    if (emp.employeeRoleId) return emp.employeeRoleId;
    // fallback: maybe role or roleName
    const match = employeeRoles.find(
      (er) =>
        er.name.toLowerCase() === String(emp.role?.roleName || "").toLowerCase()
    );
    return match?.id ?? "";
  };

  useEffect(() => {
    // reset update messages when employee changes
    setUpdateMessage("");
    setUpdateStatus(null);
    setFormErrors({});
  }, [employee]);

  const openEdit = () => {
    if (!employee) return;
    // prefill form from employee
    setForm({
      name: employee.name ?? "",
      email: employee.email ?? "",
      password: "", // keep empty - admin can set a new password if needed
      contactNumber: employee.contactNumber ?? "",
      address: employee.address ?? "",
      roleId: findRoleIdFromEmployee(employee) || "",
      departmentId: findDepartmentIdFromEmployee(employee) || "",
      employeeRoleId: findEmployeeRoleIdFromEmployee(employee) || "",
    });

    setFormErrors({});
    setShowEdit(true);
  };

  const closeEdit = () => {
    setShowEdit(false);
    setFormErrors({});
    setUpdateMessage("");
    setUpdateStatus(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required.";
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!form.email.trim()) errors.email = "Email is required.";
    else if (!emailRegex.test(form.email)) errors.email = "Email is not valid.";
    if (!form.password || form.password.length < 6)
      errors.password = "Password is required (min 6 chars).";
    const phone = String(form.contactNumber || "").replace(/\D/g, "");
    if (!phone) errors.contactNumber = "Contact number is required.";
    else if (phone.length < 10)
      errors.contactNumber = "Contact number should be at least 10 digits.";
    if (!form.address.trim()) errors.address = "Address is required.";
    if (!form.roleId) errors.roleId = "Please select a role.";
    if (!form.departmentId) errors.departmentId = "Please select a department.";
    if (!form.employeeRoleId)
      errors.employeeRoleId = "Please select an employee role.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateSubmit = async (e) => {
    e?.preventDefault();
    setUpdateMessage("");
    setUpdateStatus(null);

    if (!validateForm()) {
      setUpdateStatus("error");
      setUpdateMessage("Please fix the validation errors.");
      return;
    }

    // prepare body - ensure ids are numbers
    const body = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      contactNumber: form.contactNumber,
      address: form.address.trim(),
      roleId: Number(form.roleId),
      departmentId: Number(form.departmentId),
      employeeRoleId: Number(form.employeeRoleId),
    };

    try {
      setUpdateLoading(true);
      const res = await axios.put(
        `${API_BASE}/api/employees/update-employee/${empId}`,
        body
      );

      // assume success status 200
      setUpdateStatus("success");
      setUpdateMessage(`✅ Employee with ID ${empId} updated successfully.`);
      setShowEdit(false);

      // refresh employee details
      fetchEmployee();
    } catch (err) {
      setUpdateStatus("error");
      if (err.response && err.response.status === 404) {
        setUpdateMessage(`❌ Employee with ID ${empId} does not exist.`);
      } else if (
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        setUpdateMessage(`❌ ${err.response.data.message}`);
      } else {
        setUpdateMessage("❌ Failed to update employee. Please try again.");
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="p-1 space-y-8 max-w-6xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">Search Employee By ID</h3>

      <Card>
        <CardContent className="flex gap-4 items-center">
          <input
            ref={empIdRef}
            type="text"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            placeholder="Enter Employee ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <Button onClick={fetchEmployee}>Fetch Employee</Button>
        </CardContent>
      </Card>

      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 font-medium">{error}</div>
      )}

      {employee && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Card>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-4">
                  <User className="w-10 h-10 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    {employee.name}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{employee.contactNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{employee.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span>{employee.role?.roleName ?? employee.role}</span>
                  </div>
                </div>

                <p className="text-gray-500 italic">
                  {employee.role?.description}
                </p>

                <div className="flex gap-3 items-center">
                  <Button onClick={openEdit}>Update Profile</Button>
                  <Button
                    onClick={() => {
                      setEmpId("");
                      setEmployee(null);
                      setError("");
                    }}
                    className="bg-gray-500 hover:bg-gray-600"
                  >
                    Clear
                  </Button>
                </div>

                {/* small status message for updates */}
                {updateMessage && (
                  <div
                    className={`mt-2 text-sm font-medium px-3 py-2 rounded ${
                      updateStatus === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {updateMessage}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Leaves, Projects, Products (kept same as before) */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <SectionHeader icon={ClipboardList} title="Leaves" />
            <div className="grid gap-5 md:grid-cols-2">
              {Array.isArray(employee.leaves) &&
                employee.leaves.map((leave) => (
                  <Card
                    key={leave.id}
                    className="hover:scale-[1.02] transform transition"
                  >
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <Badge
                          text={leave.leaveType}
                          color="bg-green-100 text-green-800"
                        />
                        <Badge
                          text={leave.status}
                          color={
                            leave.status === "APPROVED"
                              ? "bg-green-200 text-green-900"
                              : leave.status === "PENDING"
                              ? "bg-yellow-200 text-yellow-900"
                              : "bg-red-200 text-red-900"
                          }
                        />
                      </div>
                      <p className="text-gray-600">{leave.reason}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {Array.isArray(leave.startDate)
                          ? leave.startDate.join("-")
                          : leave.startDate}{" "}
                        →{" "}
                        {Array.isArray(leave.endDate)
                          ? leave.endDate.join("-")
                          : leave.endDate}
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <SectionHeader icon={Briefcase} title="Projects" />
            <div className="grid gap-5 md:grid-cols-2">
              {Array.isArray(employee.projects) &&
                employee.projects.map((project) => (
                  <Card
                    key={project.id}
                    className="hover:scale-[1.02] transform transition"
                  >
                    <CardContent className="space-y-2">
                      <h4 className="font-semibold text-gray-800">
                        {project.name}
                      </h4>
                      <p className="text-gray-600">{project.description}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {Array.isArray(project.startDate)
                          ? project.startDate.join("-")
                          : project.startDate}{" "}
                        →{" "}
                        {Array.isArray(project.endDate)
                          ? project.endDate.join("-")
                          : project.endDate}
                      </p>
                      <Badge
                        text={project.status}
                        color="bg-blue-100 text-blue-800"
                      />
                    </CardContent>
                  </Card>
                ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <SectionHeader icon={Package} title="Products" />
            <div className="grid gap-5 md:grid-cols-2">
              {Array.isArray(employee.products) &&
                employee.products.map((product) => (
                  <Card
                    key={product.id}
                    className="hover:scale-[1.02] transform transition"
                  >
                    <CardContent className="space-y-2">
                      <h4 className="font-semibold text-gray-800">
                        {product.name}
                      </h4>
                      <p className="text-gray-600">{product.description}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Launch:{" "}
                        {Array.isArray(product.launchDate)
                          ? product.launchDate.join("-")
                          : product.launchDate}
                      </p>
                      <Badge
                        text={product.status}
                        color="bg-purple-100 text-purple-800"
                      />
                    </CardContent>
                  </Card>
                ))}
            </div>
          </motion.div>
        </>
      )}

      {/* EDIT / UPDATE MODAL */}
      {showEdit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeEdit();
            }}
          />

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative max-w-3xl w-full"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Update Employee (ID: {empId})
                </h3>
                <button
                  onClick={closeEdit}
                  className="p-2 rounded hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={handleUpdateSubmit}
                className="grid gap-4 md:grid-cols-2"
              >
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <TextInput
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                  {formErrors.name && (
                    <p className="text-xs text-red-600 mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <TextInput
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-600 mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  {formErrors.password && (
                    <p className="text-xs text-red-600 mt-1">
                      {formErrors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Contact Number</label>
                  <TextInput
                    value={form.contactNumber}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        contactNumber: e.target.value,
                      }))
                    }
                  />
                  {formErrors.contactNumber && (
                    <p className="text-xs text-red-600 mt-1">
                      {formErrors.contactNumber}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Address</label>
                  <input
                    value={form.address}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, address: e.target.value }))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  {formErrors.address && (
                    <p className="text-xs text-red-600 mt-1">
                      {formErrors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Role</label>
                  <select
                    value={form.roleId}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, roleId: e.target.value }))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">Select role</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.roleId && (
                    <p className="text-xs text-red-600 mt-1">
                      {formErrors.roleId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Department</label>
                  <select
                    value={form.departmentId}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        departmentId: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">Select department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.departmentId && (
                    <p className="text-xs text-red-600 mt-1">
                      {formErrors.departmentId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Employee Role</label>
                  <select
                    value={form.employeeRoleId}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        employeeRoleId: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">Select employee role</option>
                    {employeeRoles.map((er) => (
                      <option key={er.id} value={er.id}>
                        {er.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.employeeRoleId && (
                    <p className="text-xs text-red-600 mt-1">
                      {formErrors.employeeRoleId}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 flex items-center gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className={`px-4 py-2 rounded-lg font-semibold text-white ${
                      updateLoading
                        ? "bg-indigo-300 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {updateLoading ? "Updating..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={closeEdit}
                    className="px-4 py-2 rounded-lg font-semibold border border-gray-300"
                  >
                    Cancel
                  </button>

                  {updateMessage && (
                    <div
                      className={`ml-3 text-sm font-medium px-3 py-2 rounded ${
                        updateStatus === "success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {updateMessage}
                    </div>
                  )}
                </div>
              </form>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
