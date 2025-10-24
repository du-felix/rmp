// src/App.js
import React from "react";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import RatingForm from "./pages/RatingForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Layout>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rate" element={<RatingForm />} />
        </Routes>
      </Router>
    </Layout>
  );
}