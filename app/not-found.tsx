import React from "react";
import Link from "next/link";
import BotanicalFrame from "@/components/ui/BotanicalFrame";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream-100 px-4 text-center">
      <BotanicalFrame position="top" className="w-full max-w-2xl" />

      <div className="card-organic p-8 sm:p-12 max-w-md w-full my-auto space-y-4 shadow-organic">
        <span className="text-4xl sm:text-6xl font-serif font-bold text-forest-700">404</span>
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-forest-900">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
          The path you requested could not be located in the Org &amp; Aura platform.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-block bg-forest-500 hover:bg-forest-600 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full transition-all shadow-sm"
          >
            Return to Home
          </Link>
        </div>
      </div>

      <BotanicalFrame position="bottom" className="w-full max-w-2xl" />
    </div>
  );
}
