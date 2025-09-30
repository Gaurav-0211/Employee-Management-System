import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  Calendar,
  Mail,
  MapPin,
  Package,
  Phone,
  User,
} from "lucide-react";

export default function EmployeeProfile({ employee }) {
  if (!employee) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6 rounded-2xl border bg-white p-8 shadow-lg"
    >
      <h2 className="mb-6 text-3xl font-bold text-gray-700">
        Employee Profile
      </h2>

      {/* Basic Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border bg-gray-50 p-6 shadow-sm"
        >
          <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-700">
            <User className="h-5 w-5 text-indigo-500" /> Basic Details
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <strong>ID:</strong> {employee.id}
            </li>
            <li>
              <strong>Name:</strong> {employee.name}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-indigo-400" />
              {employee.email}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-indigo-400" />
              {employee.contactNumber}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-indigo-400" />
              {employee.address}
            </li>
            <li className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-indigo-400" />
              {employee.role?.roleName}{" "}
              <span className="text-sm text-gray-500">
                ({employee.role?.description})
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-400" />
              Department ID:{" "}
              <span className="font-medium">{employee.departmentId}</span>
            </li>
            <li>
              <strong>Employee Role ID:</strong>{" "}
              {employee.employeeRoleId ?? "N/A"}
            </li>
          </ul>
        </motion.div>

        {/* Leaves */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border bg-gray-50 p-6 shadow-sm"
        >
          <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-700">
            <Calendar className="h-5 w-5 text-green-500" /> Leaves
          </h3>
          {employee.leaves && employee.leaves.length > 0 ? (
            <ul className="space-y-3">
              {employee.leaves.map((leave) => (
                <motion.li
                  key={leave.id}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-lg border bg-white p-3 shadow-sm"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{leave.type}</span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        leave.status === "Approved"
                          ? "bg-green-100 text-green-600"
                          : leave.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{leave.reason}</p>
                  <p className="mt-1 text-sm text-gray-400">
                    {leave.startDate.join("-")} → {leave.endDate.join("-")}
                  </p>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No leaves found.</p>
          )}
        </motion.div>
      </div>

      {/* Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 rounded-xl border bg-gray-50 p-6 shadow-sm"
      >
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-700">
          <Package className="h-5 w-5 text-pink-500" /> Products
        </h3>
        {employee.products && employee.products.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {employee.products.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.03 }}
                className="rounded-lg border bg-white p-4 shadow-md"
              >
                <h4 className="font-semibold text-gray-800">
                  {product.name}{" "}
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                      product.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {product.status}
                  </span>
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  {product.description}
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  Launch: {product.launchDate.join("-")}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No products assigned.</p>
        )}
      </motion.div>
    </motion.div>
  );
}
