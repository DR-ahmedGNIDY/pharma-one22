import type { Config } from "tailwindcss";
// An ESM import rather than require(): this file uses `export default`, and
// Node 24 loads .ts config files as ES modules natively, where require() does
// not exist. Mixing the two crashed the dev server on the first CSS compile.
import forms from "@tailwindcss/forms";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: "#0B0B0B",
          light: "#141414",
          lighter: "#1A1A1A",
          dark: "#050505",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E6C56A",
          dark: "#B8960C",
          muted: "#8B7355",
        },
        cream: "#F5F5F5",
        "gold-glow": "rgba(212, 175, 55, 0.15)",
      },
      fontFamily: {
        arabic: ["var(--font-arabic)", "Noto Sans Arabic", "Tajawal", "sans-serif"],
        display: ["Playfair Display", "Noto Sans Arabic", "serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #E6C56A 50%, #D4AF37 100%)",
        "gold-radial": "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)",
        "dark-gradient": "linear-gradient(180deg, #0B0B0B 0%, #141414 100%)",
      },
      boxShadow: {
        gold: "0 0 20px rgba(212, 175, 55, 0.3)",
        "gold-lg": "0 0 40px rgba(212, 175, 55, 0.4)",
        "gold-sm": "0 0 10px rgba(212, 175, 55, 0.2)",
        dark: "0 4px 20px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "gold-shimmer": "goldShimmer 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        goldShimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 175, 55, 0.6)" },
        },
      },
    },
  },
  plugins: [forms],
};

export default config;
