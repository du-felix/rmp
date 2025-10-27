import React, { useState, useEffect } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RatingSlider from "../components/SlidingRater";
import RatingTags from "../components/TagsRater";
import TextBox from "../components/TextRater";
import SelectionRater from "../components/SelectionRater";

export default function RatingForm({ professor_id= 1}) {
const [professorName, setProfessorName] = useState("");
const [departmentName, setDepartmentName] = useState("");
const [categories, setCategories] = useState([]);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/categories/");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);

      // Initialize rating state dynamically with all categories
      const initialRatings = {};
      data.forEach((cat) => {
        initialRatings[cat.name] = 0; // use category.name from DB
      });
      setRatings(initialRatings);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  fetchCategories();
}, []);

  useEffect(() => {
    if (!professor_id) return; // safety check

  const fetchProfessor = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/professors/${professor_id}/`);
      if (!response.ok) throw new Error("Failed to fetch professor");
      const data = await response.json();

      setProfessorName(data.sex + " " +data.title + " " + data.name);
      setDepartmentName("Department for " + data.department?.name || "Unknown Department");
    } catch (error) {
      console.error("Error fetching professor:", error);
    }
  };

  fetchProfessor();
}, [professor_id]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/courses/")
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [ratings, setRatings] = useState({});
    const [textBoxValue, setTextBoxValue] = useState("");
    const [attendanceStatus, setAttendanceStatus] = useState("");
    const handleSubmit = async () => {
  // Define which sliders are required
  const requiredSliders = ["professor", "understanding", "examPrep"];
  const missingSliders = requiredSliders.some((key) => ratings[key] === 0);

  const missingTags = selectedTags.length === 0;
  const missingCourse = !selectedCourse;
  const missingTextBox = textBoxValue.trim() === "";

  if (missingSliders || missingTags || missingCourse || missingTextBox) {
    alert("Please complete all required fields before submitting.");
    return;
  }

  // Step 1: Create the main Rating entry
  const ratingPayload = {
    course: selectedCourse?.id,
    professor: professor_id,
    status: attendanceStatus === "Currently attending" ? "current" : "completed",
    rating_text: textBoxValue,
    tags: selectedTags.map(tag => tag.id || tag),
  };

  try {
    console.log(ratingPayload.tags);
    const ratingResponse = await fetch("http://127.0.0.1:8000/api/ratings/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ratingPayload),
    });

    if (!ratingResponse.ok) throw new Error("Failed to create Rating");
    const newRating = await ratingResponse.json();

    // Step 2: Create related RatingScore entries
    const scorePromises = Object.entries(ratings).map(([categoryName, scoreValue]) => {
      if (scoreValue > 0) {
        // Find the category object by name
        const category = categories.find(c => c.name === categoryName);
        
        return fetch("http://127.0.0.1:8000/api/rating-scores/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating: newRating.rating_id,
            category: category.id, // ✅ send ID, not name
            score: scoreValue,
          }),
        });
      }
    });

    await Promise.all(scorePromises);

    alert("Thank you! Your rating has been submitted.");
  } catch (error) {
    console.error("Error submitting rating:", error);
    alert("Something went wrong while submitting your rating. Please try again.");
  }
};
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar />
          <main className="max-w-7xl space-y-4 py-12 px-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-fit">
              <SelectionRater
                label="Select the Course"
                options={courses}
                value={selectedCourse?.id || selectedCourse}
                onChange={(course) => {
                  const selected = courses.find((c) => c.id === parseInt(course) || c.name === course);
                  setSelectedCourse(selected || course);
                }}
                required={true}
              />
              <SelectionRater
                label="Are you currently attending the course?"
                options={["Currently attending", "Completed"]}
                value={attendanceStatus}
                onChange={(status) => setAttendanceStatus(status)}
                required={true}
              />
              {categories.map((cat) => (
                <RatingSlider
                  key={cat.id}
                  label={cat.label || cat.name} // display_name if you added that field
                  value={ratings[cat.name] || 0}
                  onChange={(val) => setRatings({ ...ratings, [cat.name]: val })}
                  required={cat.required || false}
                />
              ))}
            </div>
            <RatingTags 
              label="Add up to 5 Tags"
              selectedTags={selectedTags} 
              onChange={setSelectedTags}
              required={true}
            />
            <TextBox required={true} value={textBoxValue} onChange={setTextBoxValue} />
            {/* Submit Rating Section */}
            <div className="mt-8 text-left">
              <p className="text-xs text-gray-500 mb-4 max-w-xl">
                By clicking the "Submit" button, I acknowledge that I have read and agreed to the Website's{" "}
                <a href="/" className="text-purple-600 hover:underline">Site Guidelines</a>,{" "}
                <a href="/" className="text-purple-600 hover:underline">Terms of Use</a>, and{" "}
                <a href="/" className="text-purple-600 hover:underline">Privacy Policy</a>.
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