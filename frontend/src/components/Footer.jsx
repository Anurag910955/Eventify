import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 px-6 py-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">
            <span className="text-blue-600">Event</span>ify
          </span>
          <span className="text-gray-200 text-xs">|</span>
          <span className="text-xs text-gray-400">Making event booking simple.</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs text-gray-400 font-medium">
          <Link to="/home" className="hover:text-gray-700 transition">Home</Link>
          <Link to="/about" className="hover:text-gray-700 transition">About</Link>
          <Link to="/contact" className="hover:text-gray-700 transition">Contact</Link>
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Eventify. All rights reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;
