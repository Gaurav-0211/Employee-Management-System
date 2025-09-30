// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function EmployeeEditForm({ employee }) {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: employee?.name || "",
//     email: employee?.email || "",
//     password: "",
//     contactNumber: employee?.contactNumber || "",
//     address: employee?.address || "",
//     roleId: employee?.role?.id || "",
//     departmentId: employee?.department?.id || "",
//     employeeRoleId: employee?.employeeRole?.id || "",
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   // Handle input change
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Validate fields
//   const validate = () => {
//     const newErrors = {};
//     if (!form.name.trim()) newErrors.name = "Name is required";
//     if (!form.email.trim()) newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(form.email))
//       newErrors.email = "Invalid email";
//     if (!form.password.trim()) newErrors.password = "Password is required";
//     else if (form.password.length < 6)
//       newErrors.password = "Password must be at least 6 characters";
//     if (!form.contactNumber.trim())
//       newErrors.contactNumber = "Contact number is required";
//     else if (!/^\d{10}$/.test(form.contactNumber))
//       newErrors.contactNumber = "Contact number must be 10 digits";
//     if (!form.address.trim()) newErrors.address = "Address is required";
//     if (!form.roleId) newErrors.roleId = "Role is required";
//     if (!form.departmentId) newErrors.departmentId = "Department is required";
//     if (!form.employeeRoleId)
//       newErrors.employeeRoleId = "Employee Role is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       setLoading(true);
//       const response = await fetch(
//         `http://localhost:8081/api/employees/update-employee/${employee.id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(form),
//         }
//       );

//       if (!response.ok) throw new Error("Update failed");

//       alert("Profile updated successfully!");
//       navigate("/profile"); // redirect back to profile page
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
//       <h2 className="text-2xl font-bold mb-4 text-center">
//         Edit Employee Profile
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Name */}
//         <div>
//           <label className="block font-medium">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             className="w-full border rounded-lg p-2"
//           />
//           {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block font-medium">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             className="w-full border rounded-lg p-2"
//           />
//           {errors.email && (
//             <p className="text-red-500 text-sm">{errors.email}</p>
//           )}
//         </div>

//         {/* Password */}
//         <div>
//           <label className="block font-medium">Password</label>
//           <input
//             type="password"
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             className="w-full border rounded-lg p-2"
//           />
//           {errors.password && (
//             <p className="text-red-500 text-sm">{errors.password}</p>
//           )}
//         </div>

//         {/* Contact Number */}
//         <div>
//           <label className="block font-medium">Contact Number</label>
//           <input
//             type="text"
//             name="contactNumber"
//             value={form.contactNumber}
//             onChange={handleChange}
//             className="w-full border rounded-lg p-2"
//           />
//           {errors.contactNumber && (
//             <p className="text-red-500 text-sm">{errors.contactNumber}</p>
//           )}
//         </div>

//         {/* Address */}
//         <div>
//           <label className="block font-medium">Address</label>
//           <input
//             type="text"
//             name="address"
//             value={form.address}
//             onChange={handleChange}
//             className="w-full border rounded-lg p-2"
//           />
//           {errors.address && (
//             <p className="text-red-500 text-sm">{errors.address}</p>
//           )}
//         </div>

//         {/* Role */}
//         <div>
//           <label className="block font-medium">Role</label>
//           <input
//             type="number"
//             name="roleId"
//             value={form.roleId}
//             onChange={handleChange}
//             className="w-full border rounded-lg p-2"
//           />
//           {errors.roleId && (
//             <p className="text-red-500 text-sm">{errors.roleId}</p>
//           )}
//         </div>

//         {/* Department */}
//         <div>
//           <label className="block font-medium">Department</label>
//           <input
//             type="number"
//             name="departmentId"
//             value={form.departmentId}
//             onChange={handleChange}
//             className="w-full border rounded-lg p-2"
//           />
//           {errors.departmentId && (
//             <p className="text-red-500 text-sm">{errors.departmentId}</p>
//           )}
//         </div>

//         {/* Employee Role */}
//         <div>
//           <label className="block font-medium">Employee Role</label>
//           <input
//             type="number"
//             name="employeeRoleId"
//             value={form.employeeRoleId}
//             onChange={handleChange}
//             className="w-full border rounded-lg p-2"
//           />
//           {errors.employeeRoleId && (
//             <p className="text-red-500 text-sm">{errors.employeeRoleId}</p>
//           )}
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
//         >
//           {loading ? "Updating..." : "Update Profile"}
//         </button>
//       </form>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Props:
 *  - employee: { id, name, email, contactNumber, address, role: {id}, department: {id}, employeeRole: {id} }
 *  - onClose: function to close the modal (required)
 *  - onUpdated: optional callback after successful update (e.g. to refetch user)
 */
export default function EmployeeEditForm({
  employee = {},
  onClose,
  onUpdated,
}) {
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

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Prefill when employee prop changes
  useEffect(() => {
    setForm({
      name: employee.name || "",
      email: employee.email || "",
      password: "",
      contactNumber: employee.contactNumber || "",
      address: employee.address || "",
      roleId: employee.role?.id ? String(employee.role.id) : "",
      departmentId: employee.department?.id
        ? String(employee.department.id)
        : "",
      employeeRoleId: employee.employeeRole?.id
        ? String(employee.employeeRole.id)
        : "",
    });
    setErrors({});
    setServerError("");
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined }));
  };

  // Simple validations (all fields mandatory as requested)
  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Name is required";
    if (!form.email.trim()) err.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Invalid email";
    if (!form.password.trim()) err.password = "Password is required";
    else if (form.password.length < 6)
      err.password = "Password must be at least 6 characters";
    if (!form.contactNumber.trim())
      err.contactNumber = "Contact number is required";
    else if (!/^\d{10}$/.test(form.contactNumber))
      err.contactNumber = "Contact number must be 10 digits";
    if (!form.address.trim()) err.address = "Address is required";
    if (!form.roleId) err.roleId = "Please choose a role";
    if (!form.departmentId) err.departmentId = "Please choose a department";
    if (!form.employeeRoleId)
      err.employeeRoleId = "Please choose an employee role";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    if (!employee?.id) {
      setServerError("Missing employee id. Cannot update.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      contactNumber: form.contactNumber.trim(),
      address: form.address.trim(),
      roleId: Number(form.roleId),
      departmentId: Number(form.departmentId),
      employeeRoleId: Number(form.employeeRoleId),
    };

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8081/api/employees/update-employee/${employee.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Update failed (${res.status})`);
      }

      // success
      if (onUpdated) onUpdated();
      onClose?.();
    } catch (err) {
      setServerError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl mx-auto p-6">
      <div className="flex items-start justify-between">
        <h3 className="text-2xl font-semibold text-gray-900">Edit Profile</h3>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        {serverError && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 p-2 rounded">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <p className="text-xs text-gray-500 mt-1">At least 6 characters.</p>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Number
            </label>
            <input
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.contactNumber && (
              <p className="text-red-600 text-sm mt-1">
                {errors.contactNumber}
              </p>
            )}
          </div>

          {/* Address (full width on md+) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.address && (
              <p className="text-red-600 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="roleId"
              value={form.roleId}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select role</option>
              {roles.map((r) => (
                <option key={r.id} value={String(r.id)}>
                  {r.name}
                </option>
              ))}
            </select>
            {errors.roleId && (
              <p className="text-red-600 text-sm mt-1">{errors.roleId}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              name="departmentId"
              value={form.departmentId}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d.id} value={String(d.id)}>
                  {d.name}
                </option>
              ))}
            </select>
            {errors.departmentId && (
              <p className="text-red-600 text-sm mt-1">{errors.departmentId}</p>
            )}
          </div>

          {/* Employee Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employee Role
            </label>
            <select
              name="employeeRoleId"
              value={form.employeeRoleId}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select employee role</option>
              {employeeRoles.map((er) => (
                <option key={er.id} value={String(er.id)}>
                  {er.name}
                </option>
              ))}
            </select>
            {errors.employeeRoleId && (
              <p className="text-red-600 text-sm mt-1">
                {errors.employeeRoleId}
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
