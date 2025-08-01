import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { CalendarDays, MapPin, Ticket, IndianRupee } from "lucide-react";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

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
        setError("⚠️ Failed to load bookings.");
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
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white/80 shadow-xl rounded-3xl p-6 sm:p-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 text-center mb-8 sm:mb-10 drop-shadow">
          🎫 My Bookings
        </h2>

        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">
            Loading your bookings...
          </p>
        ) : error ? (
          <p className="text-center text-red-600 font-semibold">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">You have no bookings yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition duration-300"
              >
                <h3 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-3">
                  {booking.event?.title || "Untitled Event"}
                </h3>

                <div className="space-y-2 text-gray-700 text-sm sm:text-base">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
