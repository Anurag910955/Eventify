import React from "react";
import anuragImage from "../assets/anurag.jpg";

const About = () => {
  return (
    <div className="w-full h-full overflow-x-hidden">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-blue-700 via-cyan-500 to-blue-400 text-white text-center py-16 sm:py-20 px-4 rounded-b-3xl shadow-2xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold drop-shadow-lg mb-4">
          About <span className="text-yellow-300">Eventify</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl font-medium opacity-90">
          Connecting People Through Incredible Events
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 transition-all hover:shadow-2xl hover:-translate-y-1 duration-300">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 text-center border-b-2 border-cyan-400 pb-4 mb-8">
            Who We Are
          </h2>

          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 text-justify">
            Welcome to <strong>Eventify</strong> — your one-stop destination for discovering, booking, and attending amazing events! Whether you're into music concerts, coding bootcamps, fashion shows, or university fests — we’ve curated a platform that brings people together with ease and excitement.
          </p>

          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 text-justify">
            With real-time event updates, easy ticketing, and smooth user experience, Eventify turns event management into a delightful journey — for organizers and attendees alike.
          </p>

          <p className="text-gray-700 text-base sm:text-lg leading-relaxed text-justify">
            Join a growing community of passionate event-goers and experience what it means to truly be connected.
          </p>
        </div>

        {/* Our Mission and Vision */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-100 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-3">Our Mission</h3>
            <p className="text-gray-700 text-sm sm:text-md leading-relaxed">
              To revolutionize the way people discover and attend events by providing a smooth, intuitive, and personalized experience for all.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-100 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-3">Our Vision</h3>
            <p className="text-gray-700 text-sm sm:text-md leading-relaxed">
              To become the leading global platform for event engagement — where every event feels like a celebration, and every user feels at home.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-blue-600 text-center mb-8">Why Choose Eventify?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { title: "Easy Booking", icon: "🎟️", desc: "Reserve your spot with just a few clicks — fast and secure." },
              { title: "Diverse Events", icon: "🎉", desc: "From tech to entertainment, find events that match your vibe." },
              { title: "Seamless Experience", icon: "💡", desc: "Enjoy a smooth, user-friendly interface from start to finish." },
            ].map(({ title, icon, desc }, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-xl transition">
                <div className="text-4xl mb-3">{icon}</div>
                <h4 className="text-lg sm:text-xl font-semibold text-blue-500">{title}</h4>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Section */}
        <div className="mt-20 bg-gradient-to-br from-cyan-50 to-blue-100 rounded-3xl shadow-inner p-6 sm:p-10">
          <h3 className="text-2xl sm:text-3xl font-bold text-blue-600 text-center mb-10">Meet the Developer</h3>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-10">
            {/* Developer Image */}
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-lg border-4 border-white">
              <img
                src={anuragImage}
                alt="Developer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Developer Info */}
            <div className="text-center md:text-left flex-1">
              <h4 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-2">Anurag Sen</h4>
              <p className="text-gray-700 text-sm sm:text-md leading-relaxed mb-3">
                Hi! I'm Anurag, a passionate Full Stack Developer currently pursuing B.Tech in Computer Science from Medi-Caps University. I love building modern, responsive web apps and bringing ideas to life through clean code and thoughtful UI/UX design.
              </p>
              <p className="text-gray-700 font-medium text-sm sm:text-base">
                📧 Email:{" "}
                <a href="mailto:anuragsen.cs@gmail.com" className="text-blue-600 underline">
                  sen207580@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
