import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1B7FE6",
        "background-light": "#E0E5EC",
        "background-dark": "#2C2F33",
        "accent-light": "#6D83F2",
        "accent-dark": "#7B92FF",
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
        "neo-dark-outset": "5px 5px 10px #1e2022, -5px -5px 10px #3a3e44",
        "neo-dark-inset": "inset 5px 5px 10px #1e2022, inset -5px -5px 10px #3a3e44",

        // Sign in page
        "light-neumorphic": "6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff",
        "light-neumorphic-inset": "inset 6px 6px 12px #a3b1c6, inset -6px -6px 12px #ffffff",
        "light-neumorphic-pressed": "inset 4px 4px 8px #a3b1c6, inset -4px -4px 8px #ffffff",
        "dark-neumorphic": "6px 6px 12px #0c1116, -6px -6px 12px #16212c",
        "dark-neumorphic-inset": "inset 6px 6px 12px #0c1116, inset -6px -6px 12px #16212c",
        "dark-neumorphic-pressed": "inset 4px 4px 8px #0c1116, inset -4px -4px 8px #16212c",

        // Dashboard & others
        "neo-light-convex": "8px 8px 16px #c5cad0, -8px -8px 16px #fbffff",
        "neo-light-concave": "inset 8px 8px 16px #c5cad0, inset -8px -8px 16px #fbffff",
        "neo-dark-convex": "8px 8px 16px #222528, -8px -8px 16px #36393e",
        "neo-dark-concave": "inset 8px 8px 16px #222528, inset -8px -8px 16px #36393e",
        "neomorph-light-pressed": "inset 6px 6px 12px #a3b1c6, inset -6px -6px 12px #ffffff",
        "neomorph-light": "9px 9px 16px #a3b1c6, -9px -9px 16px #ffffff",
        "neomorph-dark-pressed": "inset 6px 6px 12px #1e2022, inset -6px -6px 12px #4a4e53",
        "neomorph-dark": "9px 9px 16px #1e2022, -9px -9px 16px #4a4e53",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries")],
};

export default config;  