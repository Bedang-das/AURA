import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      "colors": {
        "paper": "#EAE7E0",
        "paper-variant": "#f4f1ed",
        "terracotta": "#d97757",
        "sage": "#849D8C",
        "espresso": "#1c1917",
        
        // Retain legacy for structural mapping if needed
        "primary": "#1c1917",
        "secondary-fixed-dim": "#bec6e0",
        "tertiary-fixed": "#ffdbc8",
        "on-primary-fixed": "#001944",
        "inverse-surface": "#2f3038",
        "on-surface-variant": "#424754",
        "primary-fixed": "#d9e2ff",
        "on-secondary-fixed-variant": "#3f465c",
        "on-secondary-container": "#5c647a",
        "outline": "#727786",
        "surface-bright": "#fbf8ff",
        "surface-container-highest": "#e3e1ec",
        "surface": "#ffffff",
        "on-primary-fixed-variant": "#004299",
        "inverse-on-surface": "#f1effa",
        "surface-container-low": "#f4f2fd",
        "outline-variant": "#c2c6d7",
        "on-error": "#ffffff",
        "on-tertiary": "#ffffff",
        "on-tertiary-fixed-variant": "#753400",
        "on-surface": "#1c1917",
        "on-tertiary-fixed": "#321300",
        "on-secondary": "#ffffff",
        "inverse-primary": "#afc6ff",
        "on-background": "#1c1917",
        "on-primary-container": "#fefcff",
        "tertiary-container": "#bb5800",
        "surface-container": "#f5f5f5",
        "primary-fixed-dim": "#afc6ff",
        "surface-variant": "#e3e1ec",
        "surface-container-high": "#e8e7f1",
        "secondary-fixed": "#dae2fd",
        "surface-tint": "#0059c8",
        "on-secondary-fixed": "#131b2e",
        "on-tertiary-container": "#fffbff",
        "on-error-container": "#93000a",
        "secondary-container": "#dae2fd",
        "error-container": "#ffdad6",
        "on-primary": "#ffffff",
        "secondary": "#565e74",
        "surface-container-lowest": "#ffffff",
        "error": "#ba1a1a",
        "primary-container": "#1b6eed",
        "surface-dim": "#dad9e3",
        "tertiary-fixed-dim": "#ffb68b",
        "tertiary": "#954500",
        "background": "#fdfaf6"
      },
      "borderRadius": {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      },
      "spacing": {
        "margin-desktop": "40px",
        "gutter": "24px",
        "margin-mobile": "16px",
        "container-max": "1280px",
        "stack-unit": "8px"
      },
      "fontFamily": {
        "headline-lg-mobile": ["Inter"],
        "headline-lg": ["Inter"],
        "body-lg": ["Inter"],
        "label-md": ["Inter"],
        "headline-md": ["Inter"],
        "display-lg": ["Inter"],
        "body-md": ["Inter"],
        "serif": ["Playfair Display", "serif"],
        "sans": ["Inter", "sans-serif"]
      },
    }
  },
  plugins: [],
};
export default config;
