import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB", // blue-600 (More standard modern blue)
        "background-light": "#F8FAFC", // slate-50
        "accent-light": "#6D83F2",
        foreground: "var(--foreground)",
        border: "#E2E8F0", // slate-200
      },
      fontFamily: {
        display: ["Manrope", "Poppins", "sans-serif"],
        sans: ["Inter", "sans-serif"], // Adding Inter as a standard sans
      },
      borderRadius: {
        DEFAULT: "0.5rem", // Standard rounded
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        full: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "card-hover": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.1)",
        float: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries")],
};

export default config;  