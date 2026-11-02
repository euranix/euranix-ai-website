import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  // Isolated build: production keeps its original entry, output and indexing rules.
  ...(mode === "design-review"
    ? {
        build: {
          outDir: "dist-review",
          assetsDir: "review-assets",
          rollupOptions: { input: "design-review/index.html" },
        },
      }
    : {}),
}));
