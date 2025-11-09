import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Button, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

const ImageUploader = ({ onResult }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => setFile(acceptedFiles[0]),
  });

  const handleUpload = async () => {
    if (!file) {
      toast.warning("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("method", "easyocr");

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/ocr/extract", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onResult(res.data);
      toast.success("Text extracted successfully!");
    } catch (error) {
      toast.error("Failed to extract text!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div
        {...getRootProps()}
        className="w-full p-10 border-2 border-dashed border-blue-500 rounded-lg text-center bg-white shadow-sm cursor-pointer"
      >
        <input {...getInputProps()} />
        {file ? (
          <p className="text-gray-600">{file.name}</p>
        ) : (
          <p className="text-gray-500">📤 Drag & drop or click to select image</p>
        )}
      </div>

      {file && (
        <img
          src={URL.createObjectURL(file)}
          alt="preview"
          className="mt-3 w-60 h-60 object-cover rounded-lg border shadow-md"
        />
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={loading}
        className="mt-4"
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Extract Text"}
      </Button>
    </div>
  );
};

export default ImageUploader;
