import React from "react";
import Image from "next/image";

interface BotanicalFrameProps {
  position?: "top" | "bottom" | "both";
  className?: string;
}

export function BotanicalFrame({ position = "both", className = "" }: BotanicalFrameProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none relative w-full ${className}`}
    >
      {(position === "top" || position === "both") && (
        <div className="relative w-full h-20 sm:h-28 md:h-36 pointer-events-none">
          {/* Top Left Foliage - Cascading lush realistic leaves */}
          <div className="absolute -top-2 sm:-top-3 -left-2 sm:-left-4 md:-left-6 w-32 sm:w-44 md:w-56 lg:w-64 aspect-[15/22] transition-all duration-500 drop-shadow-sm">
            <Image
              src="/assets/decorations/leaves-branch-left.png"
              alt="Lush botanical leaves framing top left"
              fill
              sizes="(max-width: 640px) 128px, (max-width: 768px) 176px, 256px"
              priority
              className="object-contain object-top"
            />
          </div>

          {/* Top Right Foliage - Cascading lush realistic leaves */}
          <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-4 md:-right-6 w-32 sm:w-44 md:w-56 lg:w-64 aspect-[15/22] transition-all duration-500 drop-shadow-sm">
            <Image
              src="/assets/decorations/leaves-branch.png"
              alt="Lush botanical leaves framing top right"
              fill
              sizes="(max-width: 640px) 128px, (max-width: 768px) 176px, 256px"
              priority
              className="object-contain object-top"
            />
          </div>
        </div>
      )}

      {(position === "bottom" || position === "both") && (
        <div className="relative w-full h-20 sm:h-28 md:h-36 pointer-events-none mt-8 sm:mt-12">
          {/* Bottom Left Foliage */}
          <div className="absolute -bottom-2 sm:-bottom-3 -left-2 sm:-left-4 md:-left-6 w-32 sm:w-44 md:w-56 lg:w-64 aspect-[15/22] transition-all duration-500 drop-shadow-sm">
            <Image
              src="/assets/decorations/leaves-branch-bottom-left.png"
              alt="Lush botanical leaves framing bottom left"
              fill
              sizes="(max-width: 640px) 128px, (max-width: 768px) 176px, 256px"
              className="object-contain object-bottom"
            />
          </div>

          {/* Bottom Right Foliage */}
          <div className="absolute -bottom-2 sm:-bottom-3 -right-2 sm:-right-4 md:-right-6 w-32 sm:w-44 md:w-56 lg:w-64 aspect-[15/22] transition-all duration-500 drop-shadow-sm">
            <Image
              src="/assets/decorations/leaves-branch-bottom-right.png"
              alt="Lush botanical leaves framing bottom right"
              fill
              sizes="(max-width: 640px) 128px, (max-width: 768px) 176px, 256px"
              className="object-contain object-bottom"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default BotanicalFrame;

