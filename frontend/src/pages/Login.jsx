import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginAPI } from "../services/api"; 

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await loginAPI({
        email: formData.email.trim(),
        password: formData.password
      });

      const userData = response.data?.user || response.data;
      const token = response.data?.token || response.data?.accessToken;

      if (!userData || !token) {
        throw new Error('Authentication failed: Invalid server response');
      }

      login({
        user: userData,
        token: token
      });

      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/home");
      }, 1500);

    } catch (err) {
      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Login failed. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-100 to-white px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/30 transition-all duration-300 animate-fade-in"
      >
        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-700 to-indigo-600 text-transparent bg-clip-text drop-shadow mb-8">
          Welcome to <span className="text-blue-500">Eventify</span>
        </h2>

        {error && (
          <div className="text-red-700 text-sm bg-red-100 border border-red-300 p-3 rounded-lg animate-pulse mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-700 text-sm bg-green-100 border border-green-300 p-3 rounded-lg animate-pulse mb-4">
            {success}
          </div>
        )}

        <div className="space-y-6">
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-12 py-3 text-gray-700 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition placeholder-blue-300"
            />
            
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-12 py-3 text-gray-700 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition placeholder-blue-300"
            />
            
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold tracking-wide shadow-md transform hover:scale-105 transition duration-300"
          >
            Login
          </button>
        </div>

        <p className="text-center text-sm mt-8 text-gray-700">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-semibold"
          >
            Register here
          </Link>
        </p>
        <p className="text-center text-sm mt-8 text-gray-700">
  <Link
    to="/forgot-password"
    className="text-blue-500 hover:underline"
  >
    Forgot Password?
  </Link>
</p>

      </form>
    </div>
  );
};

export default Login;
