import React, { useState, useRef } from "react";
import axios from "axios";
import { Button, TextField, Slider } from "@mui/material";
import { FaCopy, FaDownload, FaShareAlt } from "react-icons/fa";

export default function TextGeneration() {
  const [prompt, setPrompt] = useState("");
  const [maxLength, setMaxLength] = useState(120);
  const [temperature, setTemperature] = useState(1.0);
  const [topK, setTopK] = useState(50);
  const [topP, setTopP] = useState(0.95);
  const [num, setNum] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState("");
  const fullResultsRef = useRef([]);
  const intervalRef = useRef(null);

  // Word-by-word animation
  const revealWordByWord = (text) => {
    clearInterval(intervalRef.current);
    setGenerated("");
    const words = text.split(/\s+/);
    let i = 0;
    intervalRef.current = setInterval(() => {
      setGenerated((prev) => prev + " " + words[i]);
      i++;
      if (i >= words.length) clearInterval(intervalRef.current);
    }, 60);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return alert("Please enter a prompt!");
    setGenerating(true);
    setGenerated("");
    try {
      const res = await axios.post("http://127.0.0.1:8000/text/generate", {
        prompt,
        max_length: maxLength,
        temperature,
        top_k: topK,
        top_p: topP,
        num_return_sequences: num,
        trim_prompt: true,
      });
      const { results } = res.data;
      fullResultsRef.current = results;
      if (results && results.length > 0) revealWordByWord(results[0]);
    } catch (error) {
      console.error("Error:", error);
      alert("Text generation failed. Check console for details.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    const text = generated || fullResultsRef.current.join("\n\n");
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleShare = async () => {
    const text = generated || fullResultsRef.current.join("\n\n");
    if (navigator.share) {
      try {
        await navigator.share({ title: "Generated Text", text });
      } catch (e) {
        console.warn("Share cancelled", e);
      }
    } else {
      handleCopy();
      alert("Sharing not supported — copied instead.");
    }
  };

  const handleDownload = () => {
    const text = generated || fullResultsRef.current.join("\n\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated_text.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
          ✨ AI Text Generation Studio
        </h1>
        <p className="text-gray-400 mt-2">
          Generate creative, informative, or professional text instantly.
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-4xl border border-white/20">
        {/* PROMPT INPUT */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2 font-medium">Enter your prompt</label>
          <TextField
            multiline
            minRows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Write a short poem about sunrise over the mountains..."
            fullWidth
            sx={{
              "& .MuiInputBase-root": {
                color: "white",
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: "10px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.3)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.5)",
              },
            }}
          />
        </div>

        {/* SLIDERS */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm text-gray-300">Max Length: {maxLength}</label>
            <Slider min={20} max={512} value={maxLength} onChange={(e, v) => setMaxLength(v)} />
          </div>
          <div>
            <label className="text-sm text-gray-300">Temperature: {temperature.toFixed(1)}</label>
            <Slider min={0.1} max={2.0} step={0.1} value={temperature} onChange={(e, v) => setTemperature(v)} />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="text-sm text-gray-300">Top-k: {topK}</label>
            <Slider min={0} max={100} step={5} value={topK} onChange={(e, v) => setTopK(v)} />
          </div>
          <div>
            <label className="text-sm text-gray-300">Top-p: {topP.toFixed(2)}</label>
            <Slider min={0.0} max={1.0} step={0.01} value={topP} onChange={(e, v) => setTopP(v)} />
          </div>
          <div>
            <label className="text-sm text-gray-300">Sequences: {num}</label>
            <Slider min={1} max={5} value={num} onChange={(e, v) => setNum(v)} />
          </div>
        </div>

        {/* BUTTON */}
        <div className="text-center mb-8">
          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={generating}
            sx={{
              background: "linear-gradient(90deg, #7b2ff7, #f107a3)",
              padding: "10px 25px",
              fontWeight: "bold",
              borderRadius: "12px",
              "&:hover": {
                background: "linear-gradient(90deg, #9c6efb, #fa52c6)",
                transform: "scale(1.03)",
                transition: "0.3s",
              },
            }}
          >
            {generating ? "Generating..." : "Generate Text"}
          </Button>
        </div>

        {/* OUTPUT CARD */}
        <div className="bg-black/50 rounded-xl p-6 border border-white/10 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-200">Generated Output</h2>
            <div className="flex gap-3 text-gray-300">
              <FaCopy
                onClick={handleCopy}
                className="cursor-pointer hover:text-white transition"
                title="Copy"
              />
              <FaShareAlt
                onClick={handleShare}
                className="cursor-pointer hover:text-white transition"
                title="Share"
              />
              <FaDownload
                onClick={handleDownload}
                className="cursor-pointer hover:text-white transition"
                title="Download"
              />
            </div>
          </div>

          <div className="min-h-[200px] p-3 bg-gradient-to-br from-gray-900/60 to-gray-800/40 rounded-lg overflow-auto">
            {generated ? (
              <p className="text-gray-100 whitespace-pre-wrap leading-relaxed">{generated}</p>
            ) : (
              <p className="text-gray-500 italic">Generated text will appear here...</p>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-10 text-gray-500 text-sm text-center">
        Made with ❤️ by Raj Patel | Powered by GPT-2 & FastAPI
      </div>
    </div>
  );
}
