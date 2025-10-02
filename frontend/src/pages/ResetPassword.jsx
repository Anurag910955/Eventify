import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        `https://eventify-7v8x.onrender.com/api/auth/reset-password/${token}`,
        { password }
      );
      setMessage(res.data.message);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-100 to-white px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/30 transition-all duration-300 animate-fade-in"
      >
        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-700 to-indigo-600 text-transparent bg-clip-text drop-shadow mb-8">
          Reset Password
        </h2>

        {error && (
          <div className="text-red-700 text-sm bg-red-100 border border-red-300 p-3 rounded-lg animate-pulse mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="text-green-700 text-sm bg-green-100 border border-green-300 p-3 rounded-lg mb-4">
            {message}
          </div>
        )}

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm placeholder-gray-400 mb-6 transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold tracking-wide shadow-md transform hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <p className="text-center text-gray-700 text-sm mt-8">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
