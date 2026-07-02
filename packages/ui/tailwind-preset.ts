import type { Config } from "tailwindcss";

/**
 * LixenAI Light Theme Tailwind Preset
 * ─────────────────────────────────────
 * Light theme only. No dark mode.
 * Background: white (#FFFFFF) / subtle gray (#FAFAFA)
 * Primary accent: soft blue neon #5BB8FF
 * Pastel and neutral supporting palette only.
 */
export const lixenLightPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        canvas: "#FFFFFF",
        surface: "#FAFAFA",
        panel: "#FFFFFF",
        "panel-solid": "#FAFAFA",
        ink: "#1a1a2e",
        muted: "#6b7280",
        hairline: "#e5e7eb",
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        neon: {
          300: "#86cfff",
          400: "#5BB8FF",
          500: "#3AA0E8",
          600: "#2A80C8",
        },
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      boxShadow: {
        panel: "0 1px 3px rgba(0, 0, 0, 0.08)",
        glass:
          "0 1px 0 rgba(255, 255, 255, 0.6) inset, 0 4px 12px rgba(0, 0, 0, 0.05)",
        glow: "0 0 0 1px rgba(91, 184, 255, 0.35), 0 0 18px rgba(91, 184, 255, 0.35)",
        neon: "0 0 14px rgba(91, 184, 255, 0.55)",
      },
    },
  },
  plugins: [],
};