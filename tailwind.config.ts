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
        // Political entity colors (used in LayerPanel swatches)
        political: {
          israel:    "#4a7c59",
          judah:     "#5a8a3c",
          moab:      "#c47a3a",
          edom:      "#8b3a2a",
          ammon:     "#a06b2a",
          philistia: "#5c6bc0",
          amorites:  "#7a5c2a",
          bashan:    "#4a6b4a",
          canaan:    "#c8a84b",
          egypt:     "#c4a033",
          assyria:   "#6b3a6b",
          babylon:   "#8b4513",
          aram:      "#2e7d88",
          persia:    "#7b5ea7",
          phoenicia: "#1a6b8a",
          midian:    "#b8860b",
        },
      },
    },
  },
  plugins: [],
};

export default config;
