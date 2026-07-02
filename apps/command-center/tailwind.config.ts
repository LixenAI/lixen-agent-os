import type { Config } from "tailwindcss";
import { lixenLightPreset } from "@lixen/ui/tailwind-preset";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  presets: [lixenLightPreset],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
