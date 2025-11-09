import React, { useState } from "react";
import ImageUploader from "../components/ImageUploader";
import ResultDisplay from "../components/ResultDisplay";

const Home = () => {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        🧠 AI Image-to-Text OCR System
      </h1>
      <div className="w-full max-w-xl">
        <ImageUploader onResult={setResult} />
        <ResultDisplay result={result} />
      </div>
    </div>
  );
};

export default Home;
