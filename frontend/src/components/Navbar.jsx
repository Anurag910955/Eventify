import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/home", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/services", label: "Services" },
    { to: "/my-bookings", label: "My Bookings" },
    { to: "/admin-login", label: "Admin" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Brand */}
        <Link to="/home" className="text-base font-semibold text-gray-800">
          <span className="text-blue-600">Event</span>ify
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1 text-sm text-gray-500 font-medium">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`px-3 py-1.5 rounded-lg transition ${
                  isActive(link.to)
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout + Mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="hidden md:inline-flex items-center text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
          >
            Logout
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-600"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 mt-3 pt-3 pb-2 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive(link.to)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition mt-1"
          >
            Logout
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
