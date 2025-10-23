// src/components/SearchBar.jsx
import React, { useState, useEffect } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ professors: [], courses: [] });
  const [isFocused, setIsFocused] = useState(false);

  // Debounced fetch on every keystroke
  useEffect(() => {
    const fetchResults = async () => {
      const q = query.trim();
      if (!q) {
        setResults({ professors: [], courses: [] });
        return;
      }
      try {
        const [profsRes, coursesRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/professors/?search=${encodeURIComponent(q)}`),
          fetch(`http://127.0.0.1:8000/api/courses/?search=${encodeURIComponent(q)}`),
        ]);
        const [profs, courses] = await Promise.all([
          profsRes.json(),
          coursesRes.json(),
        ]);
        setResults({ professors: profs, courses });
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    const id = setTimeout(fetchResults, 300); // debounce 300ms
    return () => clearTimeout(id);
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      {/* Input + Icon */}
      <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-purple-400 transition">
        <input
          type="text"
          placeholder="Search for a professor or course..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          className="flex-grow px-6 py-3 text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none rounded-full"
          aria-label="Search"
        />
        <button type="button" className="px-5 text-purple-600 hover:text-purple-700" aria-label="Search icon">
          {/* Restored original magnifying-glass SVG icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
            />
          </svg>
        </button>
      </div>

      {/* Results dropdown (top 3 per section) */}
      {isFocused && query.trim() && (results.professors.length > 0 || results.courses.length > 0) && (
        <div className="absolute left-0 right-0 bg-white shadow-lg rounded-lg mt-2 z-10 p-3">
          {/* Professors */}
          {results.professors.slice(0, 3).map((prof) => (
            <div key={prof.id ?? prof.prof_id} className="p-2 hover:bg-gray-100 cursor-pointer rounded-md text-left">
              👩‍🏫 {(prof.sex === 'F' ? 'Frau' : prof.sex === 'M' ? 'Herr' : '')} {prof.name}
            </div>
          ))}

          {/* Courses */}
          {results.courses.slice(0, 3).map((course) => (
            <div key={course.id ?? course.course_id} className="p-2 hover:bg-gray-100 cursor-pointer rounded-md text-left">
              📘 {course.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}