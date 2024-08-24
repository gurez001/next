"use client";
import React from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

export default function Resize_image_cards({ file, index, Update_image }) {
  const image = Update_image[index] || {}; // Default to empty object if not found

  return (
    <Card shadow="sm" isPressable>
      <CardBody className="overflow-visible p-0">
        <Image
          shadow="sm"
          radius="lg"
          width="100%"
          alt={file.name}
          src={image.src || URL.createObjectURL(file)}
        />
      </CardBody>
      <CardFooter className="text-small justify-between">
        <div className="text-center w-full">
          <b>{file.name}</b>
          <div>
            Original Size: {image.originalWidth || "N/A"} x{" "}
            {image.originalHeight || "N/A"}px
          </div>
          {image.resizedWidth && (
            <div>
              Resized Size: {image.resizedWidth} x {image.resizedHeight}px
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
