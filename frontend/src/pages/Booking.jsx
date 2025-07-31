import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tickets: 1,
  });

  const [ticketPrice, setTicketPrice] = useState(null);
  const [totalPayment, setTotalPayment] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const [otpTimer, setOtpTimer] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`https://mini-project-college.onrender.com/api/events/${id}`);
        if (!res.ok) throw new Error("Failed to fetch event data");
        const event = await res.json();
        setTicketPrice(Number(event.price));
        setEventTitle(event.title || "Event");
      } catch (err) {
        setError(err.message);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (ticketPrice !== null) {
      setTotalPayment(formData.tickets * ticketPrice);
    }
  }, [formData.tickets, ticketPrice]);

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "tickets" ? Math.max(1, parseInt(value) || 1) : value,
    }));
  };

  const handleSendOtp = async () => {
    setSendingOtp(true);
    try {
      const res = await fetch("https://mini-project-college.onrender.com/api/verify-email/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      if (!res.ok) throw new Error("Failed to send OTP");
      setOtpSent(true);
      setOtpTimer(120); // 2 minutes
    } catch (err) {
      setError(err.message);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setVerifyingOtp(true);
    try {
      const res = await fetch("https://mini-project-college.onrender.com/api/verify-email/confirm-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error("OTP verification failed");
      setOtpVerified(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handlePayment = async () => {
    try {
      const res = await fetch("https://mini-project-college.onrender.com/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: totalPayment }),
      });

      const orderData = await res.json();

      const options = {
        key: "rzp_test_y6jUM8QdVudcxD",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Eventify",
        description: "Event Booking Payment",
        order_id: orderData.id,
        handler: async function (response) {
          setIsPaid(true);
          setFormData((prev) => ({
            ...prev,
            razorpayPaymentId: response.razorpay_payment_id,
          }));
        },
        prefill: {
          name: formData.name,
          email: formData.email,
        },
        theme: {
          color: "#3366cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment initiation failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.token) {
      setError("You must be logged in to book.");
      return;
    }
    if (!otpVerified) {
      setError("Please verify your OTP before booking.");
      return;
    }
    try {
      const res = await fetch("https://mini-project-college.onrender.com/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ eventId: id, ...formData, totalPayment, razorpayPaymentId: formData.razorpayPaymentId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Booking failed. Please try again.");
      }
      setSubmitted(true);
      setTimeout(() => navigate("/thank-you"), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-md border border-white/30 shadow-2xl rounded-3xl p-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-blue-700 mb-2">
          🎟️ Book Your Spot
        </h2>
        <p className="text-center text-gray-700 mb-6 text-lg md:text-xl font-medium">
          You’re booking for:{" "}
          <span className="text-black font-bold italic underline">
            {eventTitle}
          </span>
        </p>

        {ticketPrice === null ? (
          <p className="text-center text-gray-500 animate-pulse">
            Fetching event details...
          </p>
        ) : !submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold">✏️ Your Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold">📧 Email Address:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border"
              />
              {!otpSent || otpTimer === 0 ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                  className="mt-2 px-4 py-2 bg-blue-600 rounded-xl"
                >
                  {sendingOtp ? "Sending OTP..." : "Send OTP"}
                </button>
              ) : !otpVerified ? (
                <div className="mt-3">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full px-4 py-2 rounded-xl border"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={verifyingOtp}
                    className="mt-2 px-4 py-2 bg-green-600 rounded-xl"
                  >
                    {verifyingOtp ? "Verifying..." : "Verify OTP"}
                  </button>
                  <p className="text-sm text-gray-500 mt-1">
                    ⏳ You can resend OTP in {otpTimer} sec
                  </p>
                </div>
              ) : (
                <p className="text-green-600 mt-2">✅ OTP Verified</p>
              )}
            </div>

            {otpVerified && (
              <>
                <div>
                  <label className="block text-sm font-semibold">🎫 Number of Tickets:</label>
                  <input
                    type="number"
                    name="tickets"
                    value={formData.tickets}
                    onChange={handleChange}
                    min="1"
                    required
                    className="w-full px-4 py-3 rounded-2xl border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold">💰 Total Payment (₹):</label>
                  <input
                    type="text"
                    value={isNaN(totalPayment) ? "" : totalPayment}
                    readOnly
                    className="w-full px-4 py-3 rounded-2xl bg-gray-100 border cursor-not-allowed"
                  />
                </div>

                {!isPaid ? (
                  <button
                    type="button"
                    onClick={handlePayment}
                    className="w-full mt-4 py-3 bg-purple-600  font-bold rounded-2xl"
                  >
                    Pay with Razorpay
                  </button>
                ) : (
                  <p className="text-green-600 text-center font-semibold animate-pulse">
                    ✅ Payment completed. You can now confirm your booking.
                  </p>
                )}
              </>
            )}

            {error && (
              <p className="text-red-500 text-center font-semibold animate-pulse">{error}</p>
            )}

            <button
              type="submit"
              disabled={!isPaid || !otpVerified}
              className={`w-full py-3 rounded-2xl font-bold transition ${
                isPaid && otpVerified
                  ? "bg-blue-600 hover:bg-blue-700 "
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Confirm Booking
            </button>
          </form>
        ) : (
          <div className="text-center mt-8">
            <p className="text-green-600 text-lg font-semibold animate-bounce">
              🎉 Booking successful! Redirecting...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
