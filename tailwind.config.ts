import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Earthy palette fitting for an ancient map
        parchment: "#f5e6c8",
        sand: "#d4a76a",
        stone: "#8b7355",
        ink: "#2c1810",
      },
    },
  },
  plugins: [],
};

export default config;
