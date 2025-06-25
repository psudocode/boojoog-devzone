/** @type {import('tailwindcss').Config} */
import typographyPlugin from "@tailwindcss/typography";

export default {
  darkMode: "class", // This is essential for class-based dark mode
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust the path according to your project structure
  ],
  theme: {
    extend: {},
  },
  plugins: [typographyPlugin],
};
