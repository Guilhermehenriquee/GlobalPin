import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171924",
        muted: "#687083",
        line: "#e5e8ef",
        paper: "#ffffff",
        soft: "#f6f7fb",
        navy: "#09083d",
        violet: "#2115b8",
        blue: "#2367f4",
        cyan: "#43d5ff",
        green: "#46d17f",
        gold: "#f0c973",
      },
      boxShadow: {
        editorial: "0 24px 70px rgba(9, 8, 61, 0.18)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [forms],
};

export default config;
