import React from "react";

export default function SelectionRater({ label, options, value, onChange }) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white w-full">
      {/* Label */}
      <h3 className="text-sm font-semibold text-gray-800 mb-4">{label}</h3>

      {/* Centered dropdown */}
      <div className="flex justify-center">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none w-3/4 md:w-2/3"
        >
          <option value="" disabled hidden>
            Select your course...
          </option>
          {options.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}