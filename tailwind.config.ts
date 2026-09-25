import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FCFAF6",
          100: "#FBF8F2", // Core page background
          200: "#F4EFE5",
          300: "#EBE3D5",
          400: "#D8CDBB",
        },
        forest: {
          50: "#F1F6F2",
          100: "#E0ECE2",
          200: "#C2DAC6",
          300: "#9EC2A4",
          400: "#6B9B75",
          500: "#4F7C5A", // Button primary
          600: "#416A4B", // Button active
          700: "#34553C",
          800: "#27402D", // Dark footer green
          900: "#1B2E20",
        },
        charcoal: {
          600: "#4B554E",
          700: "#36423A",
          800: "#253129",
          900: "#18221C", // Main text
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cinzel", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        organic: "0 8px 30px -4px rgba(45, 62, 48, 0.08), 0 2px 8px -2px rgba(45, 62, 48, 0.04)",
        "organic-lg": "0 16px 40px -6px rgba(45, 62, 48, 0.12), 0 4px 14px -2px rgba(45, 62, 48, 0.06)",
        "organic-sm": "0 4px 14px -2px rgba(45, 62, 48, 0.06)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
