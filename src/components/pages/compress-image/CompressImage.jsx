"use client";

import React, { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import ImageCards from "@/components/comman/Image_cards";
import DragInputField from "@/components/comman/Drag_input_field";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function CompressImage() {
  const [files, setFiles] = useState([]);
  const [compressedFiles, setCompressedFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const maxFiles = 10;
  const handleImageUpload = async (incomingFiles) => {
    const selectedFiles = Array.from(incomingFiles);
    if (selectedFiles.length === 0) return;

    setFiles(selectedFiles);
    setCompressedFiles(Array(selectedFiles.length).fill(null)); // Placeholder for compressed files
    setError("");
    setCurrentFileIndex(0); // Start with the first file
  };

  const onDrop = (acceptedFiles) => {
    // Combine new files with existing files
    if (acceptedFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files.`);
      return; // Prevent adding new files
    }
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    // Notify parent component with new files
    handleImageUpload(newFiles);
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

  const handleDownloadAll = async () => {
    if (compressedFiles.length === 1) {
      // Download the single compressed file directly
      const compressedFile = compressedFiles[0];
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
    } else if (compressedFiles.length > 1) {
      const zip = new JSZip();

      // Add each compressed file to the zip
      compressedFiles.forEach((compressedFile) => {
        if (compressedFile) {
          zip.file(`compressed_${compressedFile.name}`, compressedFile);
        }
      });

      try {
        // Generate the zip file asynchronously
        const content = await zip.generateAsync({ type: "blob" });

        // Save the zip file using FileSaver.js
        saveAs(content, "compressed_images.zip");
      } catch (error) {
        setError("Error creating ZIP file:", error);
      }
    }
  };

  const handleRemoveAll = () => {
    setCompressedFiles([]); // Clear all compressed files
    setFiles([]); // Optionally, clear the original files as well
    setCurrentFileIndex(null); // Reset the index
    setError(""); // Clear any errors
    setProgress(0); // Reset progress
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
      <DragInputField onDrop={onDrop}  />
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
           className={`mt-2 py-2 px-4 rounded ${
            files.length !== compressedFiles.length
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
          onClick={handleDownloadAll}
          disabled={files.length !== compressedFiles.length}
          >
            Download All Compressed Images
          </button>
          <button
            className="mt-2 bg-red-500 text-white py-2 px-4 rounded ml-2"
            onClick={handleRemoveAll}
          >
            Remove All Compressed Images
          </button>
        </div>
      )}
    </div>
  );
}
