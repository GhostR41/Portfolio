import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Try importing works-tagger only in development
let componentTagger: any;
if (process.env.NODE_ENV === "development") {
  try {
    // dynamic import prevents errors on Vercel
    componentTagger = (await import("works-tagger")).componentTagger;
  } catch {
    componentTagger = undefined;
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger?.()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
