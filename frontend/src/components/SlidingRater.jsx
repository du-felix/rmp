import React, { useState } from "react";

export default function RatingSliderCard({ label, value, onChange }) {
  const [hoverValue, setHoverValue] = useState(null);
  const [activeButton, setActiveButton] = useState(null); // for press animation

  const colors = [
    "bg-red-500",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-lime-400",
    "bg-green-500",
  ];

  const descriptions = {
    1: "Awful",
    2: "OK",
    3: "Good",
    4: "Great",
    5: "Awesome",
  };

  const isActive = (num) => {
    if (hoverValue !== null) return num <= hoverValue;
    return num <= value;
  };

  const getText = () => {
    if (hoverValue !== null) return `${hoverValue} – ${descriptions[hoverValue]}`;
    if (value) return `${value} – ${descriptions[value]}`;
    return null;
  };

  const handleClick = (num) => {
    if (value === num) onChange(0);
    else onChange(num);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white">
      {/* Category title */}
      <h3 className="text-sm font-semibold text-gray-800 mb-4">{label}</h3>

      {/* Rating bar */}
      <div className="flex justify-center mb-3">
        {[1, 2, 3, 4, 5].map((num) => {
          const isHovered = hoverValue !== null;

          return (
            <button
              key={num}
              type="button"
              onMouseEnter={() => setHoverValue(num)}
              onMouseLeave={() => {
                setHoverValue(null);
                setActiveButton(null);
              }}
              onMouseDown={() => setActiveButton(num)} // shrink immediately
              onMouseUp={() => setActiveButton(null)}
              onClick={() => handleClick(num)}
              className={`h-10 w-12 rounded-none first:rounded-l-full last:rounded-r-full border-r border-white transform transition-all duration-150 ${
                isActive(num)
                  ? `${colors[num - 1]} ${
                      // 👇 less opacity whenever hovering, regardless of selection
                      isHovered ? "opacity-60" : "opacity-100"
                    }`
                  : "bg-gray-200 hover:bg-gray-300"
              } ${activeButton === num ? "scale-95" : "scale-100"}`}
            />
          );
        })}
      </div>

      {/* Dynamic or static text below */}
      {hoverValue !== null || value ? (
        <div className="text-center text-sm  text-gray-500 h-5">
          {getText()}
        </div>
      ) : (
        <div className="flex justify-between text-xs text-gray-500 h-5">
          <span>1 – Awful</span>
          <span>5 – Awesome</span>
        </div>
      )}
    </div>
  );
}