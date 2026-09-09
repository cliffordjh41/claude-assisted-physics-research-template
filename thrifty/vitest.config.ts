import { defineConfig } from "vitest/config"

// Test harness for the library. esbuild handles TSX via React 19's automatic
// JSX runtime — no Vite React plugin needed since tests don't use HMR.
export default defineConfig({
  esbuild: { jsx: "automatic" },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
  },
})
