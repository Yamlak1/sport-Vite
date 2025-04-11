// AdBanner.tsx
import React, { useState, useEffect } from "react";

interface AdBannerProps {
  images: string[];
  size?: "xxl" | "xl" | "lg";
  slideInterval?: number; // in milliseconds, default is 3000ms
}

const AdBanner: React.FC<AdBannerProps> = ({
  images,
  size = "xl",
  slideInterval = 3000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically slide between images if there are multiple images
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, slideInterval);
    return () => clearInterval(interval);
  }, [images, slideInterval]);

  // Set container styles based on the size prop
  let containerClass = "overflow-hidden relative";
  switch (size) {
    case "xxl":
      // Card layout: limited width with rounded corners and shadow
      containerClass += " max-w-md h-64 rounded-lg shadow-lg";
      break;
    case "xl":
      // Rectangular: full screen width with a smaller height
      containerClass += " w-full h-20";
      break;
    case "lg":
      // Smaller square
      containerClass += " w-32 h-32";
      break;
    default:
      containerClass += " w-full h-40";
  }

  return (
    <div className={containerClass}>
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Ad ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
};

export default AdBanner;
