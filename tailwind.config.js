/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FFDE59",
        dark: "#1D1721",
        bgDark: "#1E1E1E",
        bgLight: "#FAF9F6",
        "background-dark": "#1E1E1E",
        "background-light": "#FAF9F6",
        "text-dark": "#FFFFFF",
        "text-light": "#1D1721",
        "surface-dark": "#2F2F2F",
        "surface-light": "#F2F2F2",
        "elevated-surface-dark": "#3A3A3A",
        "elevated-surface-light": "#F2F2F2",
      },
    },
  },
  plugins: [],
};
