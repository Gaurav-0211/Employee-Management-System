export default function EmployeeProfile({ employee }) {
  if (!employee) {
    return null; // nothing if no employee is selected
  }

  return (
    <div className="mt-6 border rounded p-6 shadow bg-white">
      <h2 className="text-2xl font-semibold mb-4">Employee Profile</h2>

      {/* Basic Details */}
      <div className="space-y-2 mb-6">
        <p>
          <strong>ID:</strong> {employee.id}
        </p>
        <p>
          <strong>Name:</strong> {employee.name}
        </p>
        <p>
          <strong>Email:</strong> {employee.email}
        </p>
        <p>
          <strong>Contact:</strong> {employee.contactNumber}
        </p>
        <p>
          <strong>Address:</strong> {employee.address}
        </p>
        <p>
          <strong>Role:</strong> {employee.role?.roleName} (
          {employee.role?.description})
        </p>
        <p>
          <strong>Department ID:</strong> {employee.departmentId}
        </p>
        <p>
          <strong>Employee Role ID:</strong> {employee.employeeRoleId ?? "N/A"}
        </p>
      </div>

      {/* Leaves */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Leaves</h3>
        {employee.leaves && employee.leaves.length > 0 ? (
          <ul className="list-disc ml-6 space-y-1">
            {employee.leaves.map((leave) => (
              <li key={leave.id}>
                <strong>{leave.type}</strong> ({leave.status}) — {leave.reason}
                <br />
                From: {leave.startDate.join("-")} To: {leave.endDate.join("-")}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No leaves found.</p>
        )}
      </div>

      {/* Products */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Products</h3>
        {employee.products && employee.products.length > 0 ? (
          <ul className="list-disc ml-6 space-y-1">
            {employee.products.map((product) => (
              <li key={product.id}>
                <strong>{product.name}</strong> ({product.status})
                <br />
                {product.description}
                <br />
                Launch Date: {product.launchDate.join("-")}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No products assigned.</p>
        )}
      </div>
    </div>
  );
}
