import React from "react";
import ModelCard from "../components/ModelCard";
// import movieBg from "../assets/movie-bg.jpg";
// import textBg from "../assets/text-bg.jpg";
import ocrBg from "../assets/ocr-bg.png";

const Dashboard = () => {
  const models = [
    {
      title: "🎬 Movie Recommendation System",
      description: "Discover movies you'll love based on your interests and history.",
      // image: movieBg,
      route: "/movie",
      accent: "#00C9A7", // teal glow
    },
    {
      title: "🧠 Text Generation Model",
      description: "Create natural and intelligent text using state-of-the-art AI.",
      // image: textBg,
      route: "/text",
      accent: "#FF8A00", // orange glow
    },
    {
      title: "📸 Image-to-Text OCR System",
      description: "Extract text from printed, handwritten, or scanned documents.",
      image: ocrBg,
      route: "/ocr",
      accent: "#007BFF", // blue glow
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center py-10">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-blue-600 via-green-500 mb-10 drop-shadow-lg">
        AI Model Control Center
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-[90%] max-w-6xl">
        {models.map((model, i) => (
          <ModelCard key={i} {...model} />
        ))}
      </div>

      <p className="text-gray-400 mt-10 text-sm">
        © {new Date().getFullYear()} Raj Patel — AI Projects Hub
      </p>
    </div>
  );
};

export default Dashboard;
