"use client"
import React, { useState } from 'react';

const ImageConverter = () => {
  const [selectedFormat, setSelectedFormat] = useState('jpeg');
  const [image, setImage] = useState(null);
  const [output, setOutput] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormatChange = (e) => {
    setSelectedFormat(e.target.value);
  };

  const convertImage = () => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL(`image/${selectedFormat}`);
      setOutput(dataURL);
    };

    img.src = image;
  };

  return (
    <div>
      <h1>Image Converter</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <select value={selectedFormat} onChange={handleFormatChange}>
        <option value="jpeg">JPEG</option>
        <option value="png">PNG</option>
        <option value="webp">WEBP</option>
      </select>
      <button onClick={convertImage}>Convert</button>
      {output && (
        <div>
          <h2>Converted Image:</h2>
          <img src={output} alt="Converted" />
          <a href={output} download={`converted_image.${selectedFormat}`}>
            <button>Download Image</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageConverter;
