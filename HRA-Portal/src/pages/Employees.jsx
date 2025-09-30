import { useState } from "react";
import AddEmployeeForm from "../components/EmployeeComponent/AddEmployeeForm";
import DeleteEmployee from "../components/EmployeeComponent/DeleteEmployee";
import EmployeeFetchID from "../components/EmployeeComponent/EmployeeFetchID";
import EmployeeProfile from "../components/EmployeeComponent/EmployeeProfile";
import EmployeeTable from "../components/EmployeeComponent/EmployeeTable";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  //  Fetch Employees
  const fetchEmployees = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/employees/getAllEmployee`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to fetch employees");

      const data = await res.json();
      console.log("Fetched All Employees:", data);

      if (data.status === "SUCCESS" && Array.isArray(data.data.content)) {
        setEmployees(data.data.content);
        setMessage("Employees fetched successfully!");
      } else {
        setEmployees([]);
        setMessage("⚠️ No employees found");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setMessage("❌ Error fetching employees");
    } finally {
      setLoading(false);
    }
  };

  // Add Employee
  const handleAddEmployee = async (newEmployee) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/employees/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });

      if (!res.ok) throw new Error("Failed to register employee");

      const responseData = await res.json();
      console.log("Register Response:", responseData);

      setMessage(" Employee added successfully!");
      // await fetchEmployees();
    } catch (error) {
      console.error("Error adding employee:", error);
      setMessage("❌ Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Employee Management</h1>

      {/* Status Message */}
      {message && (
        <div
          className={`p-3 rounded ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-700"
              : message.startsWith("⚠️")
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Add Employee Form */}
      <div className="border rounded p-4 shadow">
        <AddEmployeeForm onAdd={handleAddEmployee} />
      </div>

      {/* Fetch Employees Button */}
      <button
        onClick={fetchEmployees}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Loading..." : "Fetch Employees"}
      </button>

      {/* Employee Table */}
      <div className="border rounded p-4 shadow">
        <EmployeeTable
          employees={employees}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
        />
      </div>
      <div className="border rounded p-4 shadow">
        <EmployeeProfile employee={selectedEmployee} />
      </div>
      <div>
        <EmployeeFetchID />
      </div>
      <div>
        <DeleteEmployee />
      </div>
    </div>
  );
}
