import React from "react";
import Image from "next/image";
import prisma from "@/lib/prisma";
import BotanicalFrame from "@/components/ui/BotanicalFrame";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const galleryItems = await prisma.galleryItem.findMany({
    where: { published: true },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="w-full relative flex flex-col items-center">
      <BotanicalFrame position="top" className="w-full max-w-5xl" />

      <div className="w-full max-w-3xl px-4 sm:px-6 py-6 sm:py-10 space-y-10">
        {/* Gallery Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-forest-800">
            Our Gallery
          </h1>
          <p className="text-xs sm:text-base text-forest-600 font-medium">
            Explore the impact and innovation behind SanDi.
          </p>
        </div>

        {/* Vertically Flowing Large Media Cards matching video */}
        <div className="space-y-8 sm:space-y-10">
          {galleryItems.map((item) => (
            <article
              key={item.id}
              className="card-organic p-4 sm:p-6 bg-white overflow-hidden group transition-all duration-300 hover:shadow-organic-lg"
            >
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden bg-cream-100 border border-cream-200">
                <Image
                  src={item.imageRef || "/assets/gallery/easwari-college.svg"}
                  alt={item.title}
                  fill
                  priority={item.displayOrder === 1}
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="mt-4 space-y-1.5 text-left">
                <h2 className="text-base sm:text-xl font-serif font-bold text-forest-900 group-hover:text-forest-700 transition-colors">
                  {item.title}
                </h2>
                {item.caption && (
                  <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                    {item.caption}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <BotanicalFrame position="bottom" className="w-full max-w-5xl" />
    </div>
  );
}
