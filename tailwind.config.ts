import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
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
