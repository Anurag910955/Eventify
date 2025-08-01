import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation} from "react-router-dom";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [event, setEvent] = useState(location.state?.event || null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`https://mini-project-college.onrender.com/api/events/${id}`);
        if (!res.ok) {
          throw new Error("Event not found");
        }
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBook = () => {
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-blue-600 text-xl font-semibold">
        Loading event details...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center mt-20 text-red-600 text-2xl font-bold">
        {error || "Event not found."}
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-100 via-white to-cyan-100 px-4 py-12 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]">
        <img
          src={event.image || "/placeholder.jpg"}
          alt={event.title || "Event Image"}
          className="w-full md:w-1/2 h-64 md:h-auto object-cover"
        />
        <div className="p-8 flex flex-col justify-between w-full">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-700 mb-4 tracking-wide">
              {event.title}
            </h1>
            <div className="space-y-2 text-gray-700 text-lg">
              <p>
                <strong className="text-blue-600">Date:</strong>{" "}
                {new Date(event.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p>
                <strong className="text-blue-600">Time:</strong> {event.time}
              </p>
              <p>
                <strong className="text-blue-600">Location:</strong> {event.location}
              </p>
              <p>
                <strong className="text-blue-600">Price:</strong> ₹{event.price}
              </p>
            </div>
            <p className="text-gray-600 mt-6 leading-relaxed text-justify border-l-4 border-cyan-300 pl-4 italic">
              {event.description}
            </p>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleBook}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition duration-300"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;