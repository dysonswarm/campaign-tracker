import baseConfig from "@campaign-tracker/ui/tailwind.config";
import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "./node_modules/@campaign-tracker/ui/**/*.{ts,tsx}",
  ],
  presets: [baseConfig],
};

export default config;
