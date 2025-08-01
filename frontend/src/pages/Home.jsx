import React, { useState, useEffect } from "react";
import EventCard from "../components/EventCard"; 
const Home = () => {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("https://mini-project-college.onrender.com/api/events");
        const data = await res.json();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events", err);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-screen min-h-screen bg-gray-50">
  {/* Hero Section */}
  <section className="relative text-center py-20 bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 text-white shadow-xl overflow-hidden">
    {/* Decorative SVG */}
    <svg className="absolute left-0 top-0 w-40 h-40 opacity-20" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="50" fill="white" />
    </svg>
    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 z-10 relative">
      Welcome to <span className="text-yellow-300">Eventify</span>
    </h1>
    <p className="text-lg md:text-2xl font-medium z-10 relative">
      Discover and Book Events Seamlessly
    </p>
  </section>

  {/* Search Bar */}
  <div className="max-w-3xl mx-auto px-4 -mt-10 relative z-20">
    <div className="bg-white p-4 rounded-2xl shadow-lg flex items-center">
      <input
        type="text"
        placeholder="Search for events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg placeholder-black"
      />
    </div>
  </div>

  {/* Events Section */}
  <section className="max-w-7xl mx-auto px-4 pt-16 pb-24">
    <h2 className="text-4xl font-bold text-center text-blue-700 mb-12 relative">
      Upcoming Events
      <span className="block w-20 h-1 bg-blue-500 mx-auto mt-2 rounded-full" />
    </h2>

    {loading ? (
      <p className="text-center text-gray-600 text-lg">Loading events...</p>
    ) : filteredEvents.length > 0 ? (
      <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    ) : (
      <div className="text-center text-gray-500 text-lg mt-10">
        <img
          src="/no-events.svg"
          alt="No Events"
          className="mx-auto w-48 h-48 opacity-60 mb-4"
        />
        No events found. Try a different keyword!
      </div>
    )}
  </section>
</div>

  );
};

export default Home;