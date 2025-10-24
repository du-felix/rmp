import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RatingSlider from "../components/SlidingRater";
import RatingTags from "../components/TagsRater";
import TextBox from "../components/TextRater";
import SelectionRater from "../components/SelectionRater";

export default function RatingForm({ professorName = "Herr Prof. Dr. Dennis Hofheinz", departmentName = "ETH Zurich – Department of Computer Science" }) {
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [rating, setRating] = useState(0);
    const handleSubmit = () => {
    console.log({
      rating,
      tags: selectedTags,
    });
  };
    return (
        <div>
          <Navbar />
          <main className="max-w-7xl mx-0 space-y-4 py-12 px-4">
            <div className="flex flex-col gap-0.5 mb-10">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">{professorName}</h1>
                <h2 className="text-lg text-gray-900">{departmentName}</h2>
              </div>
              <hr className="my-2 border-gray-300" />
              <div>
                <p className="text-sm text-gray-900 mt-2 font-medium">Rate your professor on lecture quality, comprehensibility and multiple other categories.</p>
                <p className="text-xs italic text-gray-500 max-w-lg">Please be respectful! Don’t comment on things other than directly correlated to his/her teaching quality. Profanity, derogatory things, as well as other unfitting things will get detected and deleted anyway, thank you :)</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectionRater
              label="Select the Course"
              options={["252-0051-00L – Analysis", "252-0021-00L – Algebra", "252-0307-00L – Programming"]}
              value={selectedCourse}
              onChange={setSelectedCourse}
            />
            <SelectionRater
              label="Are you currently attending the course?"
              options={["Currently attending", "Completed"]}
              value={selectedCourse}
              onChange={setSelectedCourse}
            />
              <RatingSlider label="Rate your Professor" value={rating} onChange={setRating} />
              <RatingSlider label="How difficult was it to follow the professor’s lecture?" value={rating} onChange={setRating} />
              <RatingSlider label="Was the pace of the lecture appropriate?" value={rating} onChange={setRating} />
              <RatingSlider label="Did attending the lecture help you understand the contents?" value={rating} onChange={setRating} />
              <RatingSlider label="Was it interesting or encouraging to attend the lecture?" value={rating} onChange={setRating} />
              <RatingSlider label="The lecture prepared well for the exam?" value={rating} onChange={setRating} />
            </div>
            <RatingTags 
            selectedTags={selectedTags} 
            onChange={setSelectedTags} />
            <TextBox />
            {/* Submit Rating Section */}
            <div className="mt-8 text-left">
              <p className="text-xs text-gray-500 mb-4">
                By clicking the "Submit" button, I acknowledge that I have read and agreed to the Website's{" "}
                <a href="#" className="text-purple-600 hover:underline">Site Guidelines</a>,{" "}
                <a href="#" className="text-purple-600 hover:underline">Terms of Use</a>, and{" "}
                <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>.
              </p>
              <button
                onClick={handleSubmit}
                className="bg-purple-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-purple-700 transition"
              >
                Submit Rating
              </button>
            </div>
          </main>
          <Footer />
        </div>
        
    );
}