import React, { useState, useEffect } from "react";
import axios from "axios";
import { Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0); // Countdown timer

  // Handle countdown effect
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  // Step 1: Request OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("https://mini-project-college.onrender.com/api/auth/forgot-password", { email });
      setOtpSent(true);
      setTimer(60); // Start 1-minute countdown
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("https://mini-project-college.onrender.com/api/auth/verify-otp", { email, otp });
      window.location.href = `/reset-password?email=${encodeURIComponent(email)}`;
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  // Step 3: Resend OTP
  const handleResendOtp = async () => {
    setError("");
    try {
      await axios.post("https://mini-project-college.onrender.com/api/auth/forgot-password", { email });
      setTimer(60); // Restart timer
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-indigo-400 to-purple-500 px-4">
      <form
        onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
        className="w-full max-w-md backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-xl border border-white/20"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Forgot Password?
        </h2>
        <p className="text-white/80 text-center text-sm mb-6">
          {otpSent
            ? "Enter the OTP sent to your email."
            : "Enter your registered email and we’ll send you an OTP."}
        </p>

        {error && (
          <div className="bg-red-500/20 text-red-200 p-2 rounded-md text-sm mb-3">
            {error}
          </div>
        )}

        {!otpSent && (
          <div className="relative mb-4">
            <Mail className="absolute left-3 top-2.5 text-white/70" size={20} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-300 mb-4"
            />
            {timer > 0 ? (
              <p className="text-white/70 text-sm mb-4">
                Resend OTP in {timer} seconds
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className="w-full mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-orange-500 hover:to-yellow-500 transition-all duration-300 text-white py-2 rounded-lg font-semibold shadow-md hover:shadow-lg"
              >
                Resend OTP
              </button>
            )}
          </>
        )}

        <button
          type="submit"
          disabled={otpSent && timer > 0 && !otp} // Prevent clicking too early unless entering OTP
          className={`w-full mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 transition-all duration-300 text-white py-2 rounded-lg font-semibold shadow-md hover:shadow-lg ${
            otpSent && timer > 0 && !otp ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {otpSent ? "Verify OTP" : timer > 0 ? "Send OTP" : "Send OTP"}
        </button>

        {!otpSent && (
          <p className="text-center text-white/70 text-sm mt-6">
            Remembered your password?{" "}
            <a href="/login" className="text-blue-300 hover:underline">
              Login here
            </a>
          </p>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
