import path from "node:path"

const here = import.meta.dirname
import { defineConfig } from "vitest/config"

/**
 * Unit tests for the content layer's pure functions: the block parsers and the
 * section tree. The aliases mirror tsconfig.json so a test imports exactly
 * what the app imports. Nothing here renders a page.
 */
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@content": path.resolve(here, "../content"),
      "@": path.resolve(here),
    },
  },
})
