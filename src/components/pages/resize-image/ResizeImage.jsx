"use client";
import React, { useState } from "react";
import Pica from "pica";
import Drag_input_field from "@/components/comman/Drag_input_field";
import Resize_image_cards from "@/components/comman/Resize_image_cards";
import Aside from "./Aside";

export default function ResizeImage() {
  const [images, setImages] = useState([]);
  const [origrnalfile, setFiles] = useState([]);
  const [resizedImages, setResizedImages] = useState([]);
  const [processingIndex, setProcessingIndex] = useState(null); // Track processing index
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);
  const [percentage, setPercentage] = useState(100);
  const [quality, setQuality] = useState(0.92);
  const [resizeByPercentage, setResizeByPercentage] = useState(false);
  const maxFiles = 10;

  const handleFileChange = (incomingFiles) => {
    const files = Array.from(incomingFiles);
    if (files.length) {
      const fileReaders = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
              resolve({
                src: event.target.result,
                originalWidth: img.width,
                originalHeight: img.height,
              });
            };
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(fileReaders).then((imageData) => {
        setImages(imageData);
      });
    }
  };

  const handleResize = async () => {
    if (images.length === 0) return;

    setResizedImages([]);
    const resizedImagesPromises = images.map(async (imageData, index) => {
      setProcessingIndex(index);

      const img = new Image();
      img.src = imageData.src;

      return new Promise((resolve) => {
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          let newWidth = parseInt(width);
          let newHeight = parseInt(height);

          if (resizeByPercentage) {
            newWidth = Math.round((img.width * percentage) / 100);
            newHeight = Math.round((img.height * percentage) / 100);
          }

          canvas.width = newWidth;
          canvas.height = newHeight;

          await Pica().resize(img, canvas, {
            unsharpAmount: 80,
            unsharpThreshold: 2,
          });

          const resizedImageURL = canvas.toDataURL("image/jpeg", quality);
          resolve({
            src: resizedImageURL,
            originalWidth: img.width,
            originalHeight: img.height,
            resizedWidth: newWidth,
            resizedHeight: newHeight,
          });
          setProcessingIndex(null);
        };
      });
    });

    const resizedImagesData = await Promise.all(resizedImagesPromises);
    setResizedImages(resizedImagesData);
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files.`);
      return;
    }
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles(newFiles);
    handleFileChange(newFiles);
  };

  return (
    <div className="resize-image-container">
      <div className="flex">
        <div className="w-5/6">
          <div>
            <Drag_input_field onDrop={onDrop} />
          </div>

          <div className="image-grid mt-10">
            <div className="gap-2 grid grid-cols-2 sm:grid-cols-5">
              {origrnalfile.map((file, index) => (
                <Resize_image_cards
                  key={index}
                  file={file}
                  index={index}
                  Update_image={resizedImages}
                />
              ))}
            </div>
          </div>
        </div>
      <div className="w-2/12">
        <Aside
          width={width}
          setWidth={setWidth}
          resizeByPercentage={resizeByPercentage}
          height={height}
          setHeight={setHeight}
          setResizeByPercentage={setResizeByPercentage}
          setQuality={setQuality}
          quality={quality}
          percentage={percentage}setPercentage={setPercentage}
          handleResize={handleResize}
        />
      </div>
      </div>
    </div>
  );
}
