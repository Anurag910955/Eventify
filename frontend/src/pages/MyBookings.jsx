import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Add this
import { AuthContext } from "../context/AuthContext";
import { CalendarDays, MapPin, Ticket, IndianRupee, ArrowRight } from "lucide-react"; // Added ArrowRight for icon

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ hook for navigation

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "https://mini-project-college.onrender.com/api/bookings/my-bookings",
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        setBookings(response.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) {
      fetchBookings();
    } else {
      setLoading(false);
      setError("Please log in to view your bookings.");
    }
  }, [user]);

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4">
      <div className="max-w-6xl mx-auto bg-white/80 shadow-xl rounded-3xl p-8">
        <h2 className="text-4xl font-bold text-blue-700 text-center mb-10 drop-shadow">
          🎫 My Bookings
        </h2>

        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">
            Loading your bookings...
          </p>
        ) : error ? (
          <p className="text-center text-red-600 font-semibold">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            You have no bookings yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-bold text-indigo-700 mb-3">
                    {booking.event?.title || "Untitled Event"}
                  </h3>

                  <div className="space-y-2 text-gray-700 text-sm">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-blue-500" />
                      <span>
                        {booking.event?.date
                          ? new Date(booking.event.date).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-500" />
                      <span>{booking.event?.location || "N/A"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-pink-500" />
                      <span>Tickets Booked: {booking.tickets}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <IndianRupee className="w-5 h-5 text-yellow-600" />
                      <span>Total Payment: ₹{booking.totalPayment || 0}</span>
                    </p>
                    <p className="text-gray-500 mt-1">
                      Booked on:{" "}
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* ✅ Button to view event details */}
              <button
  onClick={() => navigate(`/event/${booking.event?._id}`)}
  className="mt-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6 py-2 rounded-full flex items-center gap-2 font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-out hover:from-pink-500 hover:to-indigo-500 w-auto"
>
  View Event <ArrowRight className="w-4 h-4" />
</button>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
