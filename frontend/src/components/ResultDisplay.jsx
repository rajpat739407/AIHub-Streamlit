import React from "react";

const ResultDisplay = ({ result }) => {
  if (!result) return null;

  return (
    <div className="w-full mt-6 bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold text-blue-600 mb-2">Extracted Text:</h2>
      <pre className="whitespace-pre-wrap text-gray-800 bg-gray-50 p-3 rounded">
        {result.text || "No text found"}
      </pre>
      <p className="text-sm text-gray-500 mt-2">Method: {result.method}</p>
    </div>
  );
};

export default ResultDisplay;
