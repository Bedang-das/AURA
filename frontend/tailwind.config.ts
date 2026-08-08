import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        corporate: {
          blue: "#1D4ED8",
        }
      },
    },
  },
  plugins: [
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "bg-dot": (value: any) => ({
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='${encodeURIComponent(
              value
            )}' id='pattern-circle' cx='10' cy='10' r='1.6257413380501518'%3E%3C/circle%3E%3C/svg%3E")`,
          }),
        },
        { values: theme("backgroundColor"), type: "color" }
      );
    },
  ],
};
export default config;
