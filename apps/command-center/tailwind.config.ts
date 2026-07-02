import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark futuristic command-center canvas + translucent glass surfaces
        canvas: "#060a14",
        panel: "rgba(17, 27, 46, 0.55)",
        "panel-solid": "#101a2e",
        ink: "#e8eefb",
        muted: "#8ea2c4",
        hairline: "rgba(120, 160, 225, 0.16)",
        // Dark slate / navy navigation
        slate: {
          950: "#070d18",
          900: "#0b1424",
          800: "#13203a",
          700: "#1d2f50",
        },
        // Soft blue neon accent
        neon: {
          300: "#86c7ff",
          400: "#56a8ff",
          500: "#2f8bff",
          600: "#1f6fe6",
        },
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      boxShadow: {
        panel: "0 1px 2px rgba(2, 6, 16, 0.4)",
        glass:
          "0 1px 0 rgba(140, 180, 255, 0.06) inset, 0 12px 40px rgba(2, 8, 22, 0.55)",
        glow: "0 0 0 1px rgba(86, 168, 255, 0.35), 0 0 18px rgba(47, 139, 255, 0.35)",
        neon: "0 0 14px rgba(86, 168, 255, 0.55)",
      },
    },
  },
  plugins: [],
};

export default config;
