"use client";
import React from "react";
import { Card, CardBody, CardFooter, Image, Progress } from "@nextui-org/react";
export default function Image_cards({
  compressedFiles,
  currentFileIndex,
  index,
  file,
  progress,
}) {
  function formatFileSize(bytes) {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }
  }
  function getFileExtension(mimeType) {
    const extensionMap = {
      "image/jpeg": "JPG",
      "image/png": "PNG",
      "image/gif": "GIF",
      "image/bmp": "BMP",
      "image/webp": "WEBP",
      "image/svg+xml": "SVG",
      "image/tiff": "TIFF",
      "image/x-icon": "ICO",
    };

    return extensionMap[mimeType] || "UNKNOWN";
  }

  return (
    <Card shadow="sm" isPressable>
      <CardBody className="overflow-visible p-0">
        <Image
          shadow="sm"
          radius="lg"
          width="100%"
          alt={file.name}
          className={`image-preview ${
            compressedFiles[index]
              ? "w-full object-cover h-[140px] image-container compressed"
              : "w-full object-cover h-[140px] image-container"
          }`}
          style={{
            opacity: compressedFiles[index] ? 1 : 0.4, // Show full opacity if compressed
          }}
          src={URL.createObjectURL(file)}
        />
      </CardBody>
      <CardFooter className="text-small justify-between">
        <div className="text-center w-full">
          <b>{file.name}</b>
          <p className="text-default-500">
            <b>Orignal size:</b> {formatFileSize(file.size)}
          </p>
          {currentFileIndex === index && (
            <Progress size="sm" aria-label="Loading..." value={progress} />
          )}
          {compressedFiles[index] && (
            <div>
              {" "}
              <p className="text-default-500">
                {" "}
                <b>Compressed size:</b>{" "}
                {formatFileSize(compressedFiles[index]?.size)}
              </p>
              <p className="text-default-500">
                {" "}
                <b>Type</b> {getFileExtension(compressedFiles[index]?.type)}
              </p>
            </div>
          )}
          {/* {currentFileIndex === index ? (
            <Progress size="sm" aria-label="Loading..." value={progress} />
          ) : (
            <div>
              {" "}
              <p className="text-default-500">
                {" "}
                <b>Compressed size:</b>{" "}
                {formatFileSize(compressedFiles[index]?.size)}
              </p>
              <p className="text-default-500">
                {" "}
                <b>Type</b> {getFileExtension(compressedFiles[index]?.type)}
              </p>
            </div>
          )} */}
        </div>
      </CardFooter>
    </Card>
  );
}
