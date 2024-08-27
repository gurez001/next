"use client";
import Drag_input_field from "@/components/comman/Drag_input_field";
import React, { useState, useCallback } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function CropImage() {
  const maxFiles = 1;
  const [imageToCrop, setImageToCrop] = useState(null);
  const [imagesrc, setimagesrc] = useState(null);
  const [crop, setCrop] = useState(null);
  const [error, setError] = useState(null);
  const [output, setOutput] = useState(null);

  const handleFileChange = (file) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;
      imageElement.addEventListener("load", (e) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalWidth < 150 || naturalHeight < 150) {
          setError("Image must be at least 150 x 150 pixels.");
          setimagesrc(""); // Clear the image source if too small
        } else {
          setError(""); // Clear error if valid
        }
      });
      setimagesrc(imageUrl);
    });
    reader.readAsDataURL(file);
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
    setImageToCrop(newFiles[0]);
    handleFileChange(newFiles[0]);
  };

  const imageLoading = (e) => {
    const { width, height } = e.currentTarget;
    if (width && height) {
      const crop = makeAspectCrop(
        {
          unit: "px",
          width: 150,
        },
        1,
        width,
        height
      );
      const centercrop = centerCrop(crop, width, height);
      setCrop(centercrop);
    }
  };

  const handleCropChange = (e) => {
    const { name, value } = e.target;
    setCrop((prevCrop) => ({
      ...prevCrop,
      [name]: Number(value),
    }));
  };

  const cropImageNow = () => {
    if (!imageToCrop || !crop) return;

    const image = new Image();
    image.src = imagesrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      const pixelRatio = window.devicePixelRatio;
      canvas.width = crop.width * pixelRatio;
      canvas.height = crop.height * pixelRatio;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      const base64Image = canvas.toDataURL("image/jpeg");
      setOutput(base64Image);
    };
  };

  return (
    <div className="app">
      <div>
        <Drag_input_field onDrop={onDrop} />
      </div>
      {imagesrc && (
        <ReactCrop
          crop={crop}
          circularCrop={false}
          keepSelection
          aspect={1}
          minWidth={150}
          onChange={(px) => setCrop(px)}
          onImageLoaded={imageLoading}
        >
          <img src={imagesrc} alt="crop image" />
        </ReactCrop>
      )}
      {error && <p>{error}</p>}
      <button onClick={cropImageNow}>Crop</button>
      {output && <img src={output} alt="Cropped output" />}
      {crop && (
        <div>
          <label>
            Width:
            <input
              type="number"
              name="width"
              value={crop.width || ""}
              onChange={handleCropChange}
            />
          </label>
          <label>
            Height:
            <input
              type="number"
              name="height"
              value={crop.height || ""}
              onChange={handleCropChange}
            />
          </label>
          <label>
            X:
            <input
              type="number"
              name="x"
              value={crop.x || ""}
              onChange={handleCropChange}
            />
          </label>
          <label>
            Y:
            <input
              type="number"
              name="y"
              value={crop.y || ""}
              onChange={handleCropChange}
            />
          </label>
        </div>
      )}
    </div>
  );
}
