// src/pages/HomePage.jsx
import React from "react";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import heroIllustration from "../assets/hero_illustration.png";


export default function HomePage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Navbar />

        {/* Hero Section */}
        <main className="mt-16 flex flex-col md:flex-row items-center justify-between">
          {/* Left side: text + search */}
          <div className="max-w-2xl text-left">
            <h1 className="text-4xl font-bold text-gray-900">
              Search for your Professor at ETH
            </h1>
            <p className="text-sm italic text-gray-600 mt-2">
              Find honest reviews from fellow students about professors and courses.
            </p>

            {/* Search bar left-aligned */}
            <div className="mt-8 w-full md:w-96">
              <SearchBar />
            </div>
          </div>

          {/* Right side: placeholder for illustration (optional for later) */}
          <img
            src={heroIllustration}
            alt="Student illustration"
            className="w-170 mt-10 md:mt-0"
          />
        </main>
        <Footer />
      </div>
    </>
  );
}