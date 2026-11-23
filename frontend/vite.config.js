import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Proxy /api to the Express server so the React code just calls "/api/...".
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { "/api": "http://localhost:5000" },
  },
});
