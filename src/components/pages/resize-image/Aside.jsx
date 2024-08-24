import React, { useState } from "react";

const Aside = ({
  width,
  setWidth,
  resizeByPercentage,
  height,
  setHeight,
  setResizeByPercentage,
  percentage,
  setPercentage,
  setQuality,
  quality,
  handleResize,
}) => {
  const [active, setActive] = useState(false);
  return (
    <>
   <div>
   <h2>Resize options</h2>
      {!active ? (
        <div>
          <label className="flex gap-4 items-center">
            <span className="w-52"> Width (px):</span>
            <input
              className="w-24 p-2"
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="Width"
              disabled={resizeByPercentage}
            />
          </label>
          <label className="flex gap-4 items-center">
            <span className="w-52"> Height (px):</span>
            <input
              className="w-24 p-2"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Height"
              disabled={resizeByPercentage}
            />
          </label>
        </div>
      ) : (
        <div>
          <label>
            Percentage:
            <input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              placeholder="Percentage"
            />
          </label>
        </div>
      )}

      <label>
        Quality (0 to 1):
        <input
          type="number"
          step="0.01"
          min="0"
          max="1"
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          placeholder="Quality"
        />
      </label>

      <button onClick={handleResize}>Resize Images</button>
   </div>
    </>
  );
};

export default Aside;
