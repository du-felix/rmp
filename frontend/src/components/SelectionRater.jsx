import React from "react";

export default function SelectionRater({ label, options, value, onChange, required = false }) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white max-w-3xl">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </h3>
      <select
        value={value?.id || ""}
        onChange={(e) => {
          const selected = options.find((o) => o.id === parseInt(e.target.value));
          onChange(selected);
        }}
        className="border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none w-3/4 md:w-2/3"
      >
        <option value="">
          {label}...
        </option>
        {options.map((option) => (
          <option key={option.id || option} value={option.id || option}>
            {option.code && option.name
              ? `${option.code} – ${option.name}`
              : option.name || option}
          </option>
        ))}
      </select>
    </div>
  );
}