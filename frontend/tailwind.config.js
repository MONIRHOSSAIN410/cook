/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Pulled straight from the CookMe logo.
        brand: {
          50: "#eff5ff",
          100: "#dbe8fe",
          200: "#bfd7fe",
          300: "#93bbfd",
          400: "#6096fa",
          500: "#3b76f6",
          600: "#2563eb",
          700: "#1d4fd8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        sky: {
          400: "#38bdf8",
          500: "#0ea5e9",
        },
      },
      boxShadow: {
        card: "0 2px 10px rgba(15, 23, 42, 0.06)",
        lift: "0 12px 28px rgba(15, 23, 42, 0.14)",
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "fade-in": "fadeIn 0.4s ease-out",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
