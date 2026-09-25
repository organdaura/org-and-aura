"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import BotanicalFrame from "@/components/ui/BotanicalFrame";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "What types of waste can The Sandi Machine process?",
    answer:
      "SanDi is specifically engineered for the sanitary, contactless disposal of menstrual pads, sanitary napkins, maternity pads, infant diapers, and associated biodegradable cotton consumables.",
  },
  {
    question: "Do I need to touch the machine to dispose of waste?",
    answer:
      "No. SanDi utilizes optical infrared proximity sensors that detect hand gestures above the deposit port, automatically sliding the hermetic intake door open and shut without physical contact.",
  },
  {
    question: "Is the machine safe to place in public or school restrooms?",
    answer:
      "Yes. Designed for educational campuses, hospitals, and commercial restrooms, SanDi features cool-touch double-insulated exterior panels, mechanical fail-safe door locks during heating cycles, and electrical thermal cutoffs.",
  },
  {
    question: "How does it handle bad odors?",
    answer:
      "Our proprietary catalytic carbon filter matrix rapidly neutralizes volatile organic compounds (VOCs) and odorous gases through high-surface-area activated charcoal and heat-assisted oxidation.",
  },
  {
    question: "What are the power requirements for installation?",
    answer:
      "The system connects to standard single-phase AC power (220-240V / 50Hz or 110-120V / 60Hz) with standby power draw under 5 watts and smart on-demand thermal cycles.",
  },
];

export default function ProductPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="w-full relative flex flex-col items-center">
      <BotanicalFrame position="top" className="w-full max-w-5xl" />

      <div className="w-full max-w-4xl px-4 sm:px-6 py-6 sm:py-10 space-y-12">
        {/* Page Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-forest-800">
            The SanDi Machine
          </h1>
          <p className="text-xs sm:text-sm text-forest-600 font-medium tracking-wide">
            Next-Generation Contactless Sanitary Waste Elimination
          </p>
        </div>

        {/* Product Overview Card matching video layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Spec Diagram & Machine Card */}
          <div className="md:col-span-5 w-full space-y-4">
            <div className="card-organic p-4 bg-white relative overflow-hidden group">
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-cream-50 border border-cream-200">
                <Image
                  src="/assets/product/sandi-diagram.svg"
                  alt="The SanDi Machine Technical Diagram"
                  fill
                  priority
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-3 text-center">
                <span className="text-[11px] font-semibold text-forest-700 bg-forest-50 px-3 py-1 rounded-full border border-forest-200">
                  Architectural Specification
                </span>
              </div>
            </div>

            <div className="card-warm p-4 text-center">
              <p className="text-xs text-charcoal-700 font-medium">
                Want to evaluate SanDi for your institution?
              </p>
              <Link
                href="/support"
                className="mt-2 inline-block bg-forest-500 hover:bg-forest-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-sm"
              >
                Inquire for Pilot Deployment
              </Link>
            </div>
          </div>

          {/* Right: Product Narrative & Feature Lists */}
          <div className="md:col-span-7 space-y-6 text-left">
            {/* Product Information */}
            <div className="space-y-2">
              <h2 className="text-sm sm:text-base font-bold text-forest-800 tracking-wide">
                Product Information
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                SanDi is a smart sanitary waste disposal solution designed for the hygienic,
                safe, and sustainable management of menstrual pads and diapers. Built for modern
                public and private spaces, SanDi combines automation, cleanliness, and
                eco-conscious engineering into one compact system.
              </p>
            </div>

            {/* Why Sandi */}
            <div className="space-y-2">
              <h2 className="text-sm sm:text-base font-bold text-forest-800 tracking-wide">
                Why Sandi?
              </h2>
              <ul className="space-y-1.5 text-xs sm:text-sm text-charcoal-700">
                {[
                  "Smart touch-free disposal experience.",
                  "Advanced odor-control and air filtration system.",
                  "Fast and efficient waste processing.",
                  "Energy-efficient and low-maintenance operation.",
                  "Compact design suitable for schools, offices, hospitals, and public spaces.",
                  "Built to support cleaner and more sustainable sanitation infrastructure.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-forest-600 font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety Features */}
            <div className="space-y-2">
              <h2 className="text-sm sm:text-base font-bold text-forest-800 tracking-wide">
                Safety Features
              </h2>
              <ul className="space-y-1.5 text-xs sm:text-sm text-charcoal-700">
                {[
                  "Infrared sensor-based contactless operation.",
                  "Secure internal processing chamber with thermal protection.",
                  "Child-safe insulated exterior design.",
                  "Automated monitoring for safe and reliable performance.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-forest-600 font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions Section */}
        <div className="space-y-6 pt-6">
          <h2 className="text-xl sm:text-3xl font-serif font-bold text-forest-800 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {FAQ_DATA.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-cream-300 bg-white/70 overflow-hidden transition-all shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-4 text-left font-medium text-xs sm:text-sm text-forest-900 hover:bg-cream-50 transition-colors focus:outline-none focus:ring-2 focus:ring-forest-500"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-forest-600 transition-transform duration-300 shrink-0 ml-2 ${
                        isOpen ? "rotate-180 text-forest-800" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-charcoal-700 leading-relaxed border-t border-cream-200 bg-cream-50/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BotanicalFrame position="bottom" className="w-full max-w-5xl" />
    </div>
  );
}
