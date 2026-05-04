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
        tabayun: {
          ink: "#2C160F",
          coffee: "#2C160F",
          clay: "#2C160F",
          gold: "#C49A6C",
          sand: "#E8DDC9",
          paper: "#F6F1E7",
          pearl: "#FBF8F2",
          danger: "#8E2C1D",
          success: "#2F6B4F",
          info: "#315E72",
        },
      },
      fontFamily: {
        bold: ["var(--font-handicrafts-bold)", "sans-serif"],
        regular: ["var(--font-handicrafts-regular)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'marquee': 'marquee 60s linear infinite',
        'marquee-reverse': 'marquee-reverse 60s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
