/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        butter: {
          50: "#FFFDF0",
          100: "#FFF9D6",
          200: "#FFF4BD",
          300: "#FFED94",
          400: "#FFE566",
          500: "#FFDC33",
          DEFAULT: "#FFF4BD",
        },
        pink: {
          sweets: "#FFC0CB",
          light: "#FFD6DC",
          deep: "#FF8FA3",
          DEFAULT: "#FFC0CB",
        },
        retro: {
          red: "#D93025",
          orange: "#E8450A",
          yellow: "#F5A623",
          DEFAULT: "#D93025",
        },
        charcoal: {
          light: "#4A4A4A",
          DEFAULT: "#2C2C2C",
          dark: "#1A1A1A",
        },
        cream: "#FAF3E0",
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        retro: ["'Abril Fatface'", "cursive"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
        handwrite: ["'Caveat'", "cursive"],
      },
      borderRadius: {
        clay: "24px",
        "clay-lg": "32px",
        "clay-xl": "48px",
      },
      boxShadow: {
        clay: "6px 6px 0px #2C2C2C",
        "clay-sm": "3px 3px 0px #2C2C2C",
        "clay-lg": "8px 8px 0px #2C2C2C",
        "clay-pink": "6px 6px 0px #FF8FA3",
        "clay-butter": "6px 6px 0px #FFE566",
        "clay-red": "6px 6px 0px #D93025",
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        wiggle: "wiggle 0.5s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
