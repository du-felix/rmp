import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo_draft.png"; // adjust path if needed

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center py-6 px-8 border-b border-gray-200">
      {/* Left: Logo */}
      <Link to="/" className="flex items-center">
        <img
          src={logo}
          alt="ETH RateTheProf"
          className="w-40 h-10 object-contain"
        />
      </Link>

      {/* Center: Navigation links */}
      <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
        <Link
          to="/teaching-assistants"
          className="hover:text-purple-600 transition-colors"
        >
          Teaching Assistants
        </Link>

        <Link
          to="/professors"
          className="hover:text-purple-600 transition-colors"
        >
          Professors
        </Link>

        <Link
          to="/courses"
          className="hover:text-purple-600 transition-colors"
        >
          Courses
        </Link>

        <Link
          to="/rate"
          className="bg-purple-600 text-white px-5 py-2 rounded-full hover:bg-purple-700 transition"
        >
          Rate your Prof
        </Link>
      </div>
    </nav>
  );
}