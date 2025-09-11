import { useState } from "react";
import api from "../api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleForgot = async () => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await api.post(`/employees/send-forgot-link?email=${email}`);
      setSuccessMsg("✅ " + res.data.message);
    } catch (err) {
      setErrorMsg(
        "❌ " + (err.response?.data?.message || "Something went wrong")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Forgot Password 🔑
        </h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Enter your registered email address and we’ll send you a reset link.
        </p>

        {/* Input */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none mb-4 transition"
        />

        {/* Button */}
        <button
          onClick={handleForgot}
          disabled={loading || !email}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-transform transform hover:scale-[1.02] disabled:opacity-70"
        >
          {loading ? "Sending..." : "Send Reset Link"}
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

        {/* Back to Login */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Remember your password?{" "}
          <a href="/login" className="text-purple-600 hover:underline">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
