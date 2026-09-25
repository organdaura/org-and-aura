"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import BotanicalFrame from "@/components/ui/BotanicalFrame";

export default function HomePage() {
  // Deterministic live counter matching the reference figure 42,200,010,704
  const [carbonEmission, setCarbonEmission] = useState(42200010704);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarbonEmission((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full relative flex flex-col items-center">
      {/* Top Botanical Leaves Framing matching video */}
      <BotanicalFrame position="top" className="w-full max-w-5xl" />

      <div className="w-full max-w-3xl px-4 sm:px-6 py-4 sm:py-8 flex flex-col items-center text-center space-y-8 sm:space-y-12">
        {/* Hero Section */}
        <section className="space-y-4 max-w-2xl">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-forest-900 uppercase">
            WELCOME TO ORG AND AURA
          </h1>
          <p className="text-xs sm:text-base text-charcoal-700 font-normal leading-relaxed">
            We are dedicated to bridging the gap between necessary daily hygiene and environmental
            responsibility.
          </p>
          <div className="text-forest-600 text-lg select-none opacity-80">&rdquo;</div>
        </section>

        {/* Card 1: The Anatomy of a Clean Future */}
        <section className="w-full card-organic p-6 sm:p-8 md:p-10 relative overflow-hidden text-left transition-shadow hover:shadow-organic-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-4">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-forest-600 block">
                THIS IS ORG &amp; AURA
              </span>
              <h2 className="text-xl sm:text-3xl font-serif font-bold text-forest-900 leading-tight">
                The Anatomy of a Clean Future.
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                We don&apos;t just manage biological waste; we erase it. By fusing cutting-edge thermal
                degradation with premium, zero-emission design, we are architecting the ultimate circular economy.
              </p>
              <div className="pt-2">
                <Link
                  href="/product"
                  className="inline-flex items-center gap-1.5 bg-forest-500 hover:bg-forest-600 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>Discover Our Origins</span>
                </Link>
              </div>
            </div>

            {/* Right side geodesic sphere graphic */}
            <div className="md:col-span-5 relative h-48 sm:h-56 w-full flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image
                  src="/assets/decorations/anatomy-graphic.svg"
                  alt="The Anatomy of a Clean Future geometric model"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Card 2: Global Carbon Emission */}
        <section className="w-full card-organic p-6 sm:p-10 relative overflow-hidden text-left bg-white transition-shadow hover:shadow-organic-lg">
          {/* Subtle background wireframe sphere */}
          <div className="absolute right-0 top-0 w-64 sm:w-80 h-full pointer-events-none opacity-40">
            <Image
              src="/assets/decorations/carbon-sphere.svg"
              alt="Global carbon wireframe"
              fill
              className="object-contain object-right"
            />
          </div>

          <div className="relative z-10 max-w-lg space-y-3">
            <h2 className="text-sm sm:text-base font-semibold text-charcoal-800">
              Global Carbon Emission
            </h2>
            <div
              className="text-2xl sm:text-4xl md:text-5xl font-sans font-bold text-charcoal-900 tracking-tight"
              suppressHydrationWarning
            >
              {carbonEmission.toLocaleString("en-US")}
            </div>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
              of greenhouse gases generated. Org and Aura disrupts this cycle by eliminating harmful
              emissions right at the source.
            </p>
          </div>
        </section>

        {/* Card 3: Support Our Growth */}
        <section className="w-full card-warm p-6 sm:p-8 text-center space-y-4 transition-shadow hover:shadow-organic-lg">
          <h2 className="text-lg sm:text-2xl font-serif font-bold text-forest-900">
            Support Our Growth
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-700 max-w-md mx-auto">
            Be part of the revolution in smart menstrual and diaper waste disposal.
          </p>
          <div className="flex items-center justify-center gap-3 sm:gap-4 pt-2 flex-wrap">
            <Link
              href="/career"
              className="bg-forest-500 hover:bg-forest-600 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow"
            >
              Join our mission
            </Link>
            <Link
              href="/product"
              className="border border-charcoal-700/60 hover:border-charcoal-900 text-charcoal-800 bg-white/60 hover:bg-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300"
            >
              Learn more
            </Link>
          </div>
        </section>
      </div>

      {/* Bottom Botanical Leaves Framing */}
      <BotanicalFrame position="bottom" className="w-full max-w-5xl" />
    </div>
  );
}
