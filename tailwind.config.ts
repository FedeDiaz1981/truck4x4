import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1d3a",
        base: "#f3f5f9",
        muted: "#626e8b",
        accent: "#092d69",
        accentTwo: "#28406f",
        card: "#ffffff"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 20px 50px -20px rgba(12, 20, 33, 0.35)",
        glow: "0 0 0 4px rgba(255, 107, 53, 0.15)"
      }
    }
  },
  plugins: []
};

export default config;
