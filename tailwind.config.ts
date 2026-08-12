import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        olive: {
          50: "#f7f8f0",
          100: "#eef0dd",
          200: "#dde2bd",
          300: "#c4cd93",
          400: "#aab66d",
          500: "#8d9b4f",
          600: "#6e7b3c",
          700: "#556031",
          800: "#454d2b",
          900: "#3a4227",
          950: "#1e2412"
        },
        cream: "#faf7ef",
        gold: "#c9a227"
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "serif"]
      }
    }
  },
  plugins: []
};
export default config;
