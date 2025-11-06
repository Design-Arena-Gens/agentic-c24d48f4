import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#121826",
        iris: "#5B5BD6",
        neon: "#6BF3FF",
        ember: "#FF6B9A"
      },
      boxShadow: {
        glow: "0 10px 45px rgba(91, 91, 214, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
