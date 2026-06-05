import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "main-blue":    "var(--main-colour-blue)",
        "dark-navy":    "var(--colour-dark-navy)",
        "near-black":   "var(--colour-near-black)",
        "footer-bg":    "var(--colour-footer-bg)",
        "text-muted":   "var(--colour-text-muted)",
        "green":        "var(--secondary-colour-green)",
        "green-dark":   "var(--secondary-colour-green-dark)",
        "green-light":  "var(--secondary-colour-green-light)",
        "accent-white": "var(--accent-colour-white)",
        "warning":      "var(--warning-colour)",
      },
    },
  },
  plugins: [],
};

export default config;
