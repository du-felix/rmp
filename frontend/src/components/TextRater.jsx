import React, { useState } from "react";
//import { FaPen } from "react-icons/fa"; // for the pencil icon

export default function ReviewTextSection() {
  const [review, setReview] = useState("");
  const maxLength = 500;

  return (
    <div className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white max-w-4xl">
      {/* Header */}
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Write a Review*</h3>

      {/* Guidelines box */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-center mb-3">
          {/*<FaPen className="text-purple-600 mr-2" />*/}
          <h4 className="font-semibold text-gray-800">Guidelines</h4>
        </div>

        <ul className="text-sm text-gray-700 space-y-2">
          <li>
            • Base your review only on classes you’ve personally taken. This helps other students.
          </li>
          <li>
            • Discuss the professor’s professional abilities — teaching style, clarity, engagement.
          </li>
          <li>
            • Describe your learning experience: what helped you, what didn’t.
          </li>
        </ul>

        <hr className="my-3 border-gray-300" />

        <ul className="text-sm text-gray-700 space-y-2">
          <li>• Avoid judging personal traits (e.g. looks, accent, etc.).</li>
          <li>• Don’t claim bias or favoritism without evidence.</li>
          <li className="font-semibold text-gray-900">
            • Don’t use profanity or derogatory language — it will be removed.
          </li>
        </ul>
      </div>

      {/* Text area */}
      <div className="relative">
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          maxLength={maxLength}
          placeholder="What do you want your fellow students to know?"
          className="w-full h-40 p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
        <div className="absolute bottom-2 right-3 text-xs text-gray-500">
          {review.length}/{maxLength}
        </div>
      </div>
    </div>
  );
}