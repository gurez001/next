import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const CompressImage = ({ handleFileChange }) => {
  const [files, setFiles] = useState([]);
  const maxFiles = 10;

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

    // Check if adding the new files will exceed the maximum allowed files

    // Update state with new files
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    // Notify parent component with new files
    handleFileChange(newFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true, // Allow multiple files
  });

  return (
    <div className="max-w-xs m-auto">
      <div
        {...getRootProps({
          className:
            "dropzone px-10 py-14 border-dashed border-1 rounded-xl cursor-pointer border-current bg-red",
        })}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
    </div>
  );
};

export default CompressImage;
