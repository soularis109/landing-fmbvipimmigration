import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // GitHub Pages serves from /<repo>/ — set VITE_BASE in CI; defaults to "/" for dev and root hosting
  base: process.env.VITE_BASE ?? "/",
  plugins: [react(), tailwindcss()],
});
