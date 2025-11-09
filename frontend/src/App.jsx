import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MovieRecommendation from "./pages/MovieRecommendation";
import TextGeneration from "./pages/TextGeneration";
import ImageToTextOCR from "./pages/ImageToTextOCR";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/movie" element={<MovieRecommendation />} />
        <Route path="/text" element={<TextGeneration />} />
        <Route path="/ocr" element={<ImageToTextOCR />} />
      </Routes>
    </Router>
  );
}

export default App;
