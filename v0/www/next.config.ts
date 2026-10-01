import path from "node:path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The site root is reserved for a landing page and for sections that are
      // not the blog. Until that landing page exists the root forwards to the
      // blog, temporarily: a 307 is not cached, so the root can become a real
      // page later without fighting old browser caches.
      //
      // Every address this site ever serves is added below when it moves, and
      // nothing is ever removed. See the docs post on URLs and redirects.
      {
        source: "/",
        destination: "/blog",
        permanent: false,
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
