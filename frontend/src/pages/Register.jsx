import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerAPI } from "../services/api"; 

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await registerAPI({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
        "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-100 to-white px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/30 transition-all duration-300 animate-fade-in"
      >
        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-700 to-indigo-600 text-transparent bg-clip-text drop-shadow mb-8">
          Create your <span className="text-blue-500">Eventify</span> Account
        </h2>

        {error && (
          <div className="text-red-700 text-sm bg-red-100 border border-red-300 p-3 rounded-lg animate-pulse mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-700 text-sm bg-green-100 border border-green-300 p-3 rounded-lg animate-fade-in mb-4">
            {success}
          </div>
        )}

        <div className="space-y-6">
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-12 py-3 text-gray-800 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition placeholder-blue-300"
            />
            <span className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 text-lg">
              👤
            </span>
          </div>

          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-12 py-3 text-gray-800 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition placeholder-blue-300"
            />
            <span className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 text-lg">
              📧
            </span>
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
            <span className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 text-lg">
              🔒
            </span>
          </div>

          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-12 py-3 text-gray-700 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition placeholder-blue-300"
            />
            <span className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 text-lg">
              ✅
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold tracking-wide shadow-md transform hover:scale-105 transition duration-300"
          >
            Register
          </button>
        </div>

        <p className="text-center text-sm mt-8 text-gray-700">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-semibold"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
