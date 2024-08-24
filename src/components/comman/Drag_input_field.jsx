import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const Drag_input_field = ({ onDrop }) => {
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

export default Drag_input_field;
