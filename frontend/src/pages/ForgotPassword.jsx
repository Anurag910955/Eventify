import React, { useState, useEffect } from "react";
import axios from "axios";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false); // For button loading state

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(
        "https://eventify-7v8x.onrender.com/api/auth/forgot-password",
        { email }
      );
      setOtpSent(true);
      setTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post(
        "https://eventify-7v8x.onrender.com/api/auth/verify-otp",
        { email, otp: otp.trim() }
      );
      const token = data.token;
      if (token) {
        window.location.href = `/reset-password/${token}`;
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await axios.post(
        "https://eventify-7v8x.onrender.com/api/auth/forgot-password",
        { email }
      );
      setTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-100 to-white px-4 py-10">
      <form
        onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
        className="w-full max-w-md bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/30 transition-all duration-300 animate-fade-in"
      >
        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-700 to-indigo-600 text-transparent bg-clip-text drop-shadow mb-8">
          Forgot Password?
        </h2>

        <p className="text-center text-gray-700 mb-6 text-sm">
          {otpSent
            ? "Enter the OTP sent to your email."
            : "Enter your registered email and we’ll send you an OTP."}
        </p>

        {error && (
          <div className="text-red-700 text-sm bg-red-100 border border-red-300 p-3 rounded-lg animate-pulse mb-4">
            {error}
          </div>
        )}

        {!otpSent && (
          <div className="relative mb-6">
            <Mail className="absolute left-4 top-3 text-gray-400 text-lg" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm placeholder-gray-400 transition"
              disabled={loading}
            />
          </div>
        )}

        {otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm placeholder-gray-400 mb-6 transition"
              disabled={loading}
            />
            {timer > 0 ? (
              <p className="text-gray-600 text-sm mb-6 text-center">
                Resend OTP in {timer} seconds
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="w-full mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-orange-500 hover:to-yellow-500 transition-all duration-300 text-white py-3 rounded-2xl font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </>
        )}

        <button
          type="submit"
          disabled={loading || (otpSent && !otp)}
          className={`w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold tracking-wide shadow-md transform hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? (otpSent ? "Verifying..." : "Sending OTP...") : otpSent ? "Verify OTP" : "Send OTP"}
        </button>

        {!otpSent && (
          <p className="text-center text-gray-700 text-sm mt-8">
            Remembered your password?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-semibold">
              Login here
            </Link>
          </p>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
