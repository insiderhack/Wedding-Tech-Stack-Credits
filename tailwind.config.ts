import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        'custom': '0 2px 5px rgba(0, 0, 0, 0.2)' // Example shadow
      },
      textShadow: {
        'default': '0 2px 8px rgba(255, 255, 255, 0.8)' // Brighter color, larger blur
      },
    },
  },
  plugins: [],
};
export default config;
