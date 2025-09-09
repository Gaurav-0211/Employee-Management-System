// export default function EmployeeTable({
//   employees,
//   selectedEmployee,
//   setSelectedEmployee,
// }) {
//   if (!employees || employees.length === 0) {
//     return <p className="text-gray-500">No employees found.</p>;
//   }

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full border rounded">
//         <thead>
//           <tr className="bg-gray-100 text-left">
//             <th className="p-3">Name</th>
//             <th className="p-3">Email</th>
//             <th className="p-3">Role ID</th>
//             <th className="p-3">Department ID</th>
//           </tr>
//         </thead>
//         <tbody>
//           {employees.map((emp) => (
//             <tr
//               key={emp.id}
//               className={`cursor-pointer hover:bg-blue-50 ${
//                 selectedEmployee?.id === emp.id ? "bg-blue-100" : ""
//               }`}
//               onClick={() => setSelectedEmployee(emp)}
//             >
//               <td className="p-3">{emp.name}</td>
//               <td className="p-3">{emp.email}</td>
//               <td className="p-3">{emp.roleId}</td>
//               <td className="p-3">{emp.departmentId}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import { useState } from "react";

export default function EmployeeTable({
  employees,
  selectedEmployee,
  setSelectedEmployee,
}) {
  const [page, setPage] = useState(1);
  const pageSize = 5; // show 5 employees per page

  // role & department lookup maps
  const roleMap = {
    1: "CEO",
    2: "CTO",
    3: "CFO",
    4: "COO",
    5: "Manager",
    6: "Team Leader",
    7: "Developers",
    8: "Analyst",
    9: "Trainee",
  };

  const deptMap = {
    1: "Finance",
    2: "IT",
    3: "Sales",
    4: "Forex",
    5: "Travel",
    6: "Insurance",
  };

  if (!employees || employees.length === 0) {
    return <p className="text-gray-500">No employees found.</p>;
  }

  // pagination logic
  const totalPages = Math.ceil(employees.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const currentEmployees = employees.slice(startIndex, startIndex + pageSize);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Department</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((emp) => (
            <tr
              key={emp.id}
              className={`cursor-pointer hover:bg-blue-50 ${
                selectedEmployee?.id === emp.id ? "bg-blue-100" : ""
              }`}
              onClick={() => setSelectedEmployee(emp)}
            >
              <td className="p-3">{emp.name}</td>
              <td className="p-3">{emp.email}</td>
              <td className="p-3">{roleMap[emp.roleId] || emp.roleId}</td>
              <td className="p-3">
                {deptMap[emp.departmentId] || emp.departmentId}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded ${
            page === 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded ${
            page === totalPages
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
