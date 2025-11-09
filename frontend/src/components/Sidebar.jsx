import React from "react";
import { Link } from "react-router-dom";
import { Movie, Text, Image } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="bg-gray-900 text-white w-56 h-screen p-5 fixed top-0 left-0">
      <h2 className="text-lg font-semibold mb-6">AI Models</h2>
      <nav className="space-y-4">
        <Link to="/" className="flex items-center gap-2 hover:text-blue-400">
          <Text size={18} /> Dashboard
        </Link>
        <Link to="/ocr" className="flex items-center gap-2 hover:text-blue-400">
          <Image size={18} /> OCR Model
        </Link>
        <Link to="/movie" className="flex items-center gap-2 hover:text-blue-400">
          <Movie size={18} /> Movie Recommender
        </Link>
        <Link to="/text" className="flex items-center gap-2 hover:text-blue-400">
          <Text size={18} /> Text Generator
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
