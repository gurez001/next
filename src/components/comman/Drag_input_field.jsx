import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const CompressImage = ({ handleFileChange }) => {
  const [files, setFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    const fileArray = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    ]);

    handleFileChange(fileArray);
  };

  const removeFile = (file) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
    URL.revokeObjectURL(file.preview); // Clean up the URL object
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
