import React, { useState, useEffect } from "react";
import EventCard from "../components/EventCard";

const Home = () => {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("https://eventify-olive-seven.vercel.app/api/events");
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
      <section className="bg-white border-b border-gray-100 px-6 py-20 text-center">
        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-100 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
          Live events available
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-5 leading-tight tracking-tight">
          Discover &amp; Book <br />
          <span className="text-blue-600">Events Near You</span>
        </h1>
        <p className="text-base md:text-lg text-gray-400 max-w-xl mx-auto mb-10">
          Find the best concerts, workshops, meetups and more — all in one place.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-gray-600 text-xs flex-shrink-0"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-center gap-10 text-center">
          <div>
            <p className="text-xl font-semibold text-gray-800">{events.length}+</p>
            <p className="text-xs text-gray-400">Total events</p>
          </div>
          <div className="w-px h-8 bg-gray-100"></div>
          <div>
            <p className="text-xl font-semibold text-gray-800">
              {events.filter(e => new Date(e.date) > new Date()).length}
            </p>
            <p className="text-xs text-gray-400">Upcoming</p>
          </div>
          <div className="w-px h-8 bg-gray-100"></div>
          <div>
            <p className="text-xl font-semibold text-gray-800">
              {[...new Set(events.map(e => e.location))].length}
            </p>
            <p className="text-xs text-gray-400">Locations</p>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {search ? `Results for "${search}"` : "Upcoming Events"}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="bg-gray-100 rounded-xl h-44 mb-4"></div>
                <div className="bg-gray-100 rounded h-4 w-3/4 mb-2"></div>
                <div className="bg-gray-100 rounded h-3 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">No events found</p>
            <p className="text-xs text-gray-400">Try searching with a different keyword</p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-xs text-blue-600 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
