// export default Register;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Register() {
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
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await api.post("/employees/register", form);
      setForm({
        name: "",
        email: "",
        password: "",
        contactNumber: "",
        address: "",
        roleId: "",
        departmentId: "",
        employeeRoleId: "",
      });

      if (res.data.status === "SUCCESS") {
        setSuccessMsg("🎉 Registration successful! Redirecting to login...");
        // Delay navigation by 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setErrorMsg("❌ " + (res.data.message || "Registration failed"));
      }
    } catch (err) {
      setErrorMsg(
        "❌ " + (err.response?.data?.message || "Registration failed")
      );
    } finally {
      setLoading(false);
    }
  };

  // Predefined options
  const roles = [
    { id: 1, roleName: "CEO" },
    { id: 2, roleName: "CTO" },
    { id: 3, roleName: "CFO" },
    { id: 4, roleName: "COO" },
    { id: 5, roleName: "Manager" },
    { id: 6, roleName: "Team Leader" },
    { id: 7, roleName: "Developers" },
    { id: 8, roleName: "Analyst" },
    { id: 9, roleName: "Trainee" },
  ];

  const departments = [
    { id: 1, departmentName: "Finance" },
    { id: 2, departmentName: "IT" },
    { id: 3, departmentName: "Sales" },
    { id: 4, departmentName: "Forex" },
    { id: 5, departmentName: "Travel" },
  ];

  const employeeRoles = [
    { id: 1, name: "SUPER_ADMIN" },
    { id: 2, name: "ADMIN" },
    { id: 3, name: "USER" },
    { id: 4, name: "NORMAL" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Employee Registration ✨
        </h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Fill in your details to register and join the organization.
        </p>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
          />
        </div>

        {/* Contact Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Number
          </label>
          <input
            type="text"
            name="contactNumber"
            placeholder="Enter contact number"
            value={form.contactNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            name="address"
            placeholder="Enter address"
            value={form.address}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
          />
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            name="roleId"
            value={form.roleId}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
          >
            <option value="">-- Select Role --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.roleName}
              </option>
            ))}
          </select>
        </div>

        {/* Department */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <select
            name="departmentId"
            value={form.departmentId}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
          >
            <option value="">-- Select Department --</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.departmentName}
              </option>
            ))}
          </select>
        </div>

        {/* Employee Role */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employee Role
          </label>
          <select
            name="employeeRoleId"
            value={form.employeeRoleId}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
          >
            <option value="">-- Select Employee Role --</option>
            {employeeRoles.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Register Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-transform transform hover:scale-[1.02] disabled:opacity-70"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Messages */}
        {successMsg && (
          <p className="mt-4 text-green-600 text-center font-medium">
            {successMsg}
          </p>
        )}
        {errorMsg && (
          <p className="mt-4 text-red-600 text-center font-medium">
            {errorMsg}
          </p>
        )}

        {/* Redirect */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
