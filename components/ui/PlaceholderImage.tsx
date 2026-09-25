import React, { useState } from "react";
import Image from "next/image";

interface PlaceholderImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "video" | "square" | "portrait" | "wide" | string;
  fill?: boolean;
  priority?: boolean;
  fallbackText?: string;
}

export function PlaceholderImage({
  src,
  alt,
  className = "",
  aspectRatio = "video",
  priority = false,
  fallbackText,
}: PlaceholderImageProps) {
  const [hasError, setHasError] = useState(false);

  // Aspect ratio classes
  const aspectClass =
    aspectRatio === "video"
      ? "aspect-[16/9]"
      : aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "portrait"
      ? "aspect-[3/4]"
      : aspectRatio === "wide"
      ? "aspect-[21/9]"
      : "";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-cream-200 border border-cream-300/60 shadow-organic-sm ${aspectClass} ${className}`}
    >
      {!hasError ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 hover:scale-[1.02]"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full w-full p-4 text-center bg-cream-200 text-charcoal-700">
          <div className="w-12 h-12 rounded-full bg-forest-100 flex items-center justify-center text-forest-600 mb-2 font-bold text-sm">
            OA
          </div>
          <span className="text-xs font-medium max-w-[80%] line-clamp-2">
            {fallbackText || alt}
          </span>
          <span className="text-[10px] text-forest-500 uppercase tracking-widest mt-1">
            Placeholder Asset
          </span>
        </div>
      )}
    </div>
  );
}

export default PlaceholderImage;
