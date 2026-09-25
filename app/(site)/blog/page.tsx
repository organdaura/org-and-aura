import React from "react";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import BotanicalFrame from "@/components/ui/BotanicalFrame";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  // Custom CTA text mapping to match the video recording
  const getCtaText = (title: string) => {
    if (title.includes("Waste Management")) return "Explore Current Trends \u2192";
    if (title.includes("Pilot Program")) return "View Case Study \u2192";
    if (title.includes("Interns")) return "Explore Careers \u2192";
    if (title.includes("Thermal Degradation")) return "Read the Science \u2192";
    return "Read Full Article \u2192";
  };

  return (
    <div className="w-full relative flex flex-col items-center">
      <BotanicalFrame position="top" className="w-full max-w-5xl" />

      <div className="w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12">
        {/* Section Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-forest-800">
            Latest News &amp; Insights
          </h1>
          <p className="text-xs sm:text-sm text-forest-600 font-medium tracking-wide">
            Perspectives on Circular Sanitation, Material Science, and Engineering
          </p>
        </div>

        {/* 2-Column Editorial Grid matching video */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {posts.map((post) => {
            const dateFormatted = new Intl.DateTimeFormat("en-US", {
              month: "long",
              year: "numeric",
            }).format(new Date(post.publishedAt));

            return (
              <article
                key={post.id}
                className="card-organic p-5 sm:p-7 bg-white flex flex-col justify-between transition-all duration-300 hover:shadow-organic-lg group"
              >
                <div className="space-y-3">
                  <h2 className="text-base sm:text-lg font-bold text-forest-900 group-hover:text-forest-600 transition-colors leading-snug">
                    <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                      {post.title}
                    </Link>
                  </h2>

                  <div className="text-[11px] sm:text-xs text-forest-600/90 font-medium">
                    Published: {dateFormatted} | {post.category}
                  </div>

                  <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed line-clamp-4">
                    {post.excerpt}
                  </p>

                  <div className="pt-1">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-xs font-semibold text-forest-700 hover:text-forest-900 transition-colors group-hover:underline"
                    >
                      <span>{getCtaText(post.title)}</span>
                    </Link>
                  </div>
                </div>

                {/* Card image container below text matching video layout */}
                <div className="mt-5 relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-cream-100 border border-cream-200">
                  <Image
                    src={post.imageRef || "/assets/blog/waste-management.svg"}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <BotanicalFrame position="bottom" className="w-full max-w-5xl" />
    </div>
  );
}
