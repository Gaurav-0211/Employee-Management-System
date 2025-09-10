import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  // 🔹 Validation function
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email))
      newErrors.email = "Enter a valid email address";

    if (!password) newErrors.password = "Password is required";
    else if (!passRegex.test(password))
      newErrors.password =
        "Min 6 chars, include 1 uppercase, 1 number & 1 special char";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important for refreshToken cookie
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();

      // Save token + user
      login(data.accessToken, data.user);

      // Redirect to intended page
      navigate(from, { replace: true });
    } catch (err) {
      setErrors({ form: "Invalid email or password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Welcome Back☺️
        </h2>

        {/* Global form error */}
        {errors.form && (
          <p className="text-red-600 text-sm mb-3 text-center">{errors.form}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={`w-full px-4 py-3 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? "focus:ring-red-400" : "focus:ring-blue-400"
              } transition`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`w-full px-4 py-3 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? "focus:ring-red-400" : "focus:ring-blue-400"
              } transition`}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-blue-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-600 transition duration-300 disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?
          <button
            onClick={() => navigate("/register")}
            className="ml-1 text-blue-600 hover:underline focus:outline-none"
          >
            Sign Up
          </button>
          <div className="mt-2">
            <button
              onClick={() => navigate("/send-forgot-link")}
              className="ml-1 text-blue-600 hover:underline focus:outline-none"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
