"use client";
import React from "react";
import { isTouchDevice } from "@/utils/device";

const CloseIcon = () => (
  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#7d7d7d" />
    <path
      d="M8 8l8 8M16 8l-8 8"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

interface PhotoThumbnailProps {
  seed: string | number;
  label?: string;
}

const PhotoThumbnail: React.FC<PhotoThumbnailProps> = ({ seed, label }) => {
  const [hovered, setHovered] = React.useState(false);
  const [touch, setTouch] = React.useState(false);

  React.useEffect(() => {
    setTouch(isTouchDevice());
  }, []);

  return (
    <div
      className="relative w-24 h-24 rounded-lg flex items-center justify-center border border-gray-400/80 bg-gray-100 cursor-pointer"
      onMouseEnter={() => !touch && setHovered(true)}
      onMouseLeave={() => !touch && setHovered(false)}
    >
      <img
        src={`https://picsum.photos/seed/${seed}/96/96`}
        alt={`Photo ${seed}`}
        width={96}
        height={96}
        className="object-cover w-full h-full rounded-lg"
      />
      {/* Mild tint overlay animation on hover (non-touch) */}
      {hovered && !touch && (
        <div className="absolute inset-0 bg-black/30 rounded-lg transition-opacity duration-200 opacity-100" />
      )}
      {/* Always show close on touch, show on hover for non-touch */}
      {(touch || hovered) && (
        <button
          type="button"
          className="absolute w-7 h-7 top-1 right-1 bg-white rounded-full p-1 shadow-md z-10 flex items-center justify-center -translate-y-1/2 translate-x-1/2"
          // onClick={onRemove} // Uncomment and pass onRemove prop if needed
          aria-label="Remove photo"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
};

export default PhotoThumbnail;
