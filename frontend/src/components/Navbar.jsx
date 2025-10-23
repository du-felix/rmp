// src/components/Navbar.jsx
import React from "react";
import logo from "../assets/logo_draft.png"; // 👈 import the logo file

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center py-6 px-8 border-b border-gray-200">
      {/* Left: Logo */}
      <a href="/" className="flex items-center">
        <img src={logo} alt="ETH RateTheProf" className="w-40 h-10 object-contain" />
        </a>

      {/* Center: Navigation links */}
      <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
        <a href="#" className="hover:text-purple-600 transition-colors">
          Teaching Assistants
        </a>
        <a href="#" className="hover:text-purple-600 transition-colors">
          Professors
        </a>
        <a href="#" className="hover:text-purple-600 transition-colors">
          Courses
        </a>
        <button className="bg-purple-600 text-white px-5 py-2 rounded-full hover:bg-purple-700 transition">
        Rate your Prof
      </button>
      </div>

      {/* Right: Button */}

    </nav>
  );
}