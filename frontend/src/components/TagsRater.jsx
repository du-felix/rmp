import React, { useEffect, useState } from "react";

export default function TagRater({ selectedTags = [], onChange }) {
  const [tags, setTags] = useState([]);
  const [pressedTag, setPressedTag] = useState(null);
  const MAX_TAGS = 5;

  const getKey = (tag) => {
    const k = tag.id ?? tag.tag_id ?? tag.name;
    return String(k);
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/tags/");
        const data = await res.json();
        setTags(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };
    fetchTags();
  }, []);

  const toggleTag = (tagKey) => {
    if (selectedTags.includes(tagKey)) {
      onChange(selectedTags.filter((k) => k !== tagKey));
    } else if (selectedTags.length < MAX_TAGS) {
      onChange([...selectedTags, tagKey]);
    }
  };

  const isAtLimit = selectedTags.length >= MAX_TAGS;

  return (
    <div className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-800">
          Describe your Professor
        </h3>
        <span
          className={`text-xs font-medium ${
            isAtLimit ? "text-red-500" : "text-gray-500"
          }`}
        >
          {selectedTags.length}/{MAX_TAGS} selected
        </span>
      </div>

      {/* Tag buttons */}
      <div className="flex flex-wrap gap-3">
        {tags.length === 0 ? (
          <p className="text-gray-500 text-sm italic">Loading tags...</p>
        ) : (
          tags.map((tag) => {
            const key = getKey(tag);
            const isSelected = selectedTags.includes(key);
            const isPressed = pressedTag === key;
            const isDisabled = isAtLimit && !isSelected;

            return (
              <button
                key={key}
                onClick={() => !isDisabled && toggleTag(key)}
                onMouseDown={() => !isDisabled && setPressedTag(key)}
                onMouseUp={() => setPressedTag(null)}
                onMouseLeave={() => setPressedTag(null)}
                disabled={isDisabled}
                className={`px-4 py-2 text-sm rounded-full border transition-all duration-150 transform ${
                  isSelected
                    ? "bg-purple-600 text-white border-purple-600"
                    : isDisabled
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                } ${isPressed ? "scale-95" : "scale-100"}`}
              >
                {tag.name ?? key}
              </button>
            );
          })
        )}
      </div>

      {/*{isAtLimit && (
        <p className="text-xs text-red-500 mt-3">
          You can select up to {MAX_TAGS} tags only.
        </p>
      )}*/}
    </div>
  );
}