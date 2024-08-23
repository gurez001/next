"use client";

import React, { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import ImageCards from "@/components/comman/Image_cards";
import DragInputField from "@/components/comman/Drag_input_field";

export default function CompressImage() {
  const [files, setFiles] = useState([]);
  const [compressedFiles, setCompressedFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const handleImageUpload = async (incomingFiles) => {
    const selectedFiles = Array.from(incomingFiles);
    if (selectedFiles.length === 0) return;

    setFiles(selectedFiles);
    setCompressedFiles(Array(selectedFiles.length).fill(null)); // Placeholder for compressed files
    setError("");
    setCurrentFileIndex(0); // Start with the first file
  };

  const compressNextFile = async () => {
    if (currentFileIndex === null || currentFileIndex >= files.length) return;

    const file = files[currentFileIndex];
    let targetSizeKB = 100; // Target size in KB
    let targetSize = targetSizeKB * 1024; // Convert KB to Bytes
    let compressedFile = file;
    let quality = 1.0;
    let options = {
      maxSizeMB: file.size / 1024 / 1024,
      useWebWorker: true,
      initialQuality: quality,
    };

    setProgress(0); // Reset progress for the new file

    try {
      while (compressedFile.size > targetSize && quality > 0.1) {
        options.initialQuality = quality;
        compressedFile = await imageCompression(file, options);
        quality -= 0.05;
        setProgress((1 - quality) * 100); // Update progress
      }

      setCompressedFiles((prevFiles) => {
        const updatedFiles = [...prevFiles];
        updatedFiles[currentFileIndex] = compressedFile;
        return updatedFiles;
      });

      // Move to the next file after a brief delay
      setTimeout(() => setCurrentFileIndex((prevIndex) => prevIndex + 1), 500);

      if (compressedFile.size > targetSize) {
        setError(
          "Unable to compress the file to the desired size without significant quality loss."
        );
      } else {
        setProgress(100); // Complete progress
      }
    } catch (error) {
      setError("Failed to compress image. Please try again.");
      console.error("Error compressing image:", error);
    }
  };

  useEffect(() => {
    if (
      files.length > 0 &&
      currentFileIndex !== null &&
      currentFileIndex < files.length
    ) {
      compressNextFile();
    }
  }, [files, currentFileIndex]);

  const handleDownloadAll = () => {
    compressedFiles.forEach((compressedFile) => {
      if (compressedFile) {
        const url = URL.createObjectURL(compressedFile);
        const link = document.createElement("a");
        link.href = url;
        link.download = `compressed_${compressedFile.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <div className="compress-image">
      <div className="py-10">
        <h1 className="text-2xl">Compress Images</h1>
        <p>
          Compress JPG, PNG, GIF, BMP, WEBP, SVG, TIFF or ICO with the best
          quality and compression.
        </p>
      </div>
      <DragInputField handleFileChange={handleImageUpload} error={error} />
      {error && <p className="text-red-500">{error}</p>}
      <div className="image-grid mt-10">
        <div className="gap-2 grid grid-cols-2 sm:grid-cols-5">
          {files.map((file, index) => (
            <ImageCards
              key={index}
              progress={progress}
              currentFileIndex={currentFileIndex}
              file={file}
              index={index}
              compressedFiles={compressedFiles}
            />
          ))}
        </div>
      </div>
      {compressedFiles.some((file) => file) && (
        <div className="mt-4">
          <button
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
            onClick={handleDownloadAll}
          >
            Download All Compressed Images
          </button>
        </div>
      )}
    </div>
  );
}
