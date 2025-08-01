import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  if (!event) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden group">
  {/* Event Image */}
  <div className="relative w-full h-48">
    <img
      src={event?.image || "/placeholder.jpg"}
      alt={event?.title || "Event"}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
    <div className="absolute top-2 right-2 bg-yellow-400 text-sm text-black font-semibold px-3 py-1 rounded-full shadow-md">
      ₹{event?.price ?? "Free"}
    </div>
  </div>

  {/* Event Info */}
  <div className="p-5 space-y-2">
    <h3 className="text-2xl font-bold text-blue-700 leading-snug">
      {event?.title || "Untitled Event"}
    </h3>

    <p className="text-gray-600 text-sm">
      <strong>Date:</strong>{" "}
      {new Date(event.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </p>
    <p className="text-gray-600 text-sm">
      <strong>Location:</strong> {event?.location || "Unknown"}
    </p>

    <div className="pt-4">
      <Link
        to={`/event/${event._id}`} state={{ event }}
        className="inline-block text-white bg-blue-100 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-md"
      >
        View Details
      </Link>
    </div>
  </div>
</div>

  );
};

export default EventCard;