import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/why-this-matters/",
  plugins: [react()],
});
