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
} from "lucide-react";
import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function EmployeeFetchID() {
  const [empId, setEmpId] = useState("");
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        setEmployee(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("❌ Failed to fetch employee details.");
        setLoading(false);
      });
  };

  const Badge = ({ text, color }) => (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${color}`}
    >
      {text}{" "}
    </span>
  );

  const Card = ({ children, className }) => (
    <div
      className={`bg-white/70 backdrop-blur-md border border-gray-200 shadow-lg rounded-xl p-5 transition hover:shadow-2xl ${className}`}
    >
      {children}{" "}
    </div>
  );

  const CardContent = ({ children }) => <div>{children}</div>;

  const Button = ({ children, onClick, className }) => (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={`px-5 py-2 mt-[1rem] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-indigo-700 transition ${className}`}
    >
      {children}
    </motion.button>
  );

  const TextInput = ({ ...props }) => (
    <input
      type="text"
      {...props}
      className="border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  );

  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-3">
      {" "}
      <Icon className="w-5 h-5 text-blue-600" />{" "}
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>{" "}
    </div>
  );

  return (
    <div className="p-1 space-y-8  max-w-6xl mx-auto">
      {" "}
      <h3 className="text-xl font-semibold mb-4 ">Fetch Employee by ID</h3>
      <Card>
        {" "}
        <CardContent className="flex gap-4 items-center">
          <TextInput
            type="number"
            placeholder="Enter Employee ID"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            className="max-w-xs"
          />{" "}
          <Button onClick={fetchEmployee}>Fetch Employee</Button>{" "}
        </CardContent>{" "}
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
      {/* Error */}
      {error && (
        <div className="text-center text-red-600 font-medium">{error}</div>
      )}
      {employee && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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
                    <span>{employee.role?.roleName}</span>
                  </div>
                </div>
                <p className="text-gray-500 italic">
                  {employee.role?.description}
                </p>
                <Button className="mt-3">Update Profile</Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <SectionHeader icon={ClipboardList} title="Leaves" />
            <div className="grid gap-5 md:grid-cols-2">
              {employee.leaves.map((leave) => (
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
                      {leave.startDate.join("-")} → {leave.endDate.join("-")}
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
              {employee.projects.map((project) => (
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
                      {project.startDate.join("-")} →{" "}
                      {project.endDate.join("-")}
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
          >
            <SectionHeader icon={Package} title="Products" />
            <div className="grid gap-5 md:grid-cols-2">
              {employee.products.map((product) => (
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
                      Launch: {product.launchDate.join("-")}
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
    </div>
  );
}
