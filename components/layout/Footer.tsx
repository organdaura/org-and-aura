import React from "react";
import { Linkedin, Youtube, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  const socialLinks = [
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/org-and-aura",
      icon: Linkedin,
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@organdaura",
      icon: Youtube,
    },
    {
      name: "Instagram",
      href: "https://instagram.com/organdaura",
      icon: Instagram,
    },
    {
      name: "Facebook",
      href: "https://facebook.com/organdaura",
      icon: Facebook,
    },
    {
      name: "X",
      href: "https://x.com/organdaura",
      icon: Twitter,
    },
  ];

  return (
    <footer className="w-full bg-[#416A4B] text-white mt-auto py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center space-y-6 text-center">
        {/* Circular Social Media Icons matching video */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
          {socialLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit Org & Aura on ${item.name}`}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-[#416A4B] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
              >
                <Icon className="w-5 h-5 fill-current" />
              </a>
            );
          })}
        </div>

        {/* Copyright Notice */}
        <p className="text-sm text-cream-100/90 font-medium tracking-wide">
          &copy; 2026 Org and Aura. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
