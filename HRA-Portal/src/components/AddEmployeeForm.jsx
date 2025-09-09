import { useState } from "react";

export default function AddEmployeeForm({ onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    address: "",
    roleId: "",
    departmentId: "",
    employeeRoleId: "",
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      roleId: Number(formData.roleId),
      departmentId: Number(formData.departmentId),
      employeeRoleId: Number(formData.employeeRoleId),
    };

    onAdd(payload);

    // reset form
    setFormData({
      name: "",
      email: "",
      password: "",
      contactNumber: "",
      address: "",
      roleId: "",
      departmentId: "",
      employeeRoleId: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Add New Employee</h2>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      />

      <input
        type="text"
        name="contactNumber"
        placeholder="Contact Number"
        value={formData.contactNumber}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      />

      <textarea
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      />

      <select
        name="roleId"
        value={formData.roleId}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      >
        <option value="">Select Role</option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        ))}
      </select>

      <select
        name="departmentId"
        value={formData.departmentId}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      >
        <option value="">Select Department</option>
        {departments.map((dept) => (
          <option key={dept.id} value={dept.id}>
            {dept.name}
          </option>
        ))}
      </select>

      <select
        name="employeeRoleId"
        value={formData.employeeRoleId}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      >
        <option value="">Select Employee Role</option>
        {employeeRoles.map((empRole) => (
          <option key={empRole.id} value={empRole.id}>
            {empRole.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
      >
        Add Employee
      </button>
    </form>
  );
}
