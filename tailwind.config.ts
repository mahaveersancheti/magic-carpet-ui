import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1B7FE6",
        "background-light": "#E0E5EC",
        "accent-light": "#6D83F2",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        display: ["Manrope", "Poppins", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px",
      },
      boxShadow: {
        // Landing page
        "neo-light-outset": "5px 5px 10px #bec3c9, -5px -5px 10px #ffffff",
        "neo-light-inset": "inset 5px 5px 10px #bec3c9, inset -5px -5px 10px #ffffff",

        // Sign in page
        "light-neumorphic": "6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff",
        "light-neumorphic-inset": "inset 6px 6px 12px #a3b1c6, inset -6px -6px 12px #ffffff",
        "light-neumorphic-pressed": "inset 4px 4px 8px #a3b1c6, inset -4px -4px 8px #ffffff",

        // Dashboard & others
        "neo-light-convex": "8px 8px 16px #c5cad0, -8px -8px 16px #fbffff",
        "neo-light-concave": "inset 8px 8px 16px #c5cad0, inset -8px -8px 16px #fbffff",
        "neomorph-light-pressed": "inset 6px 6px 12px #a3b1c6, inset -6px -6px 12px #ffffff",
        "neomorph-light": "9px 9px 16px #a3b1c6, -9px -9px 16px #ffffff",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries")],
};

export default config;  