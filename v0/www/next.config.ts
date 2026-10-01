import path from "node:path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The site root is app/(main)/page.tsx, the root landing of the gg
      // funnel, so no rule for / lives here. Every address this site ever
      // serves is added below when it moves, and nothing is ever removed.
      // See the docs post on URLs and redirects.
      //
      // Monthly gaming releases moved from the root blog to the gaming section
      // on 2026-10-02, when the site gained sections (11brain task 11gg-004).
      {
        source: "/blog/monthly-releases/:postId",
        destination: "/gaming/blog/monthly-releases/:postId",
        permanent: true,
      },
      {
        source: "/blog/monthly-releases",
        destination: "/gaming/blog/monthly-releases",
        permanent: true,
      },
    ]
  },
  turbopack: {
    root: path.resolve(__dirname, "../.."),
    rules: {
      "*.md": {
        loaders: [path.resolve(__dirname, "loaders/raw-markdown-loader.cjs")],
        as: "*.js",
      },
    },
  },
}

export default nextConfig
