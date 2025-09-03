import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Root-level Vite config serving source from frontend/ and public assets from frontend/public
export default defineConfig({
  plugins: [react()],
  publicDir: "frontend/public",
});
