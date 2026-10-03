import path from "node:path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 2026 Pokémon Champions news and updates (11gg-017); specific rules precede section redirects.
      {
        source: "/pokemon/champions/blog/updates",
        destination: "/pokemon/champions/blog/2026-pokemon-champions-news-and-updates",
        permanent: true,
      },
      {
        source: "/pokemon/champions/blog/updates/:postId",
        destination: "/pokemon/champions/blog/2026-pokemon-champions-news-and-updates/:postId",
        permanent: true,
      },
      // WoW Forever pre-release news and updates (11gg-016); specific rules precede section redirects.
      {
        source: "/world-of-warcraft/forever/blog/news",
        destination: "/world-of-warcraft/forever/blog/wow-forever-pre-release-news-and-updates",
        permanent: true,
      },
      {
        source: "/world-of-warcraft/forever/blog/news/:postId",
        destination: "/world-of-warcraft/forever/blog/wow-forever-pre-release-news-and-updates/:postId",
        permanent: true,
      },
      // Chapter 7: Season 4 news and updates (11gg-015); specific rules precede section redirects.
      {
        source: "/fortnite/blog/chapter-7-season-4",
        destination: "/fortnite/blog/chapter-7-season-4-news-and-updates",
        permanent: true,
      },
      {
        source: "/fortnite/blog/chapter-7-season-4/:postId",
        destination: "/fortnite/blog/chapter-7-season-4-news-and-updates/:postId",
        permanent: true,
      },
      {
        source: "/fortnite/br/blog/chapter-7-season-4",
        destination: "/fortnite/blog/chapter-7-season-4-news-and-updates",
        permanent: true,
      },
      {
        source: "/fortnite/br/blog/chapter-7-season-4/:postId",
        destination: "/fortnite/blog/chapter-7-season-4-news-and-updates/:postId",
        permanent: true,
      },
      // 2026 monthly gaming releases (11gg-014); specific rules precede section redirects.
      {
        source: "/gaming/blog/monthly-releases",
        destination: "/gaming/blog/2026-monthly-gaming-releases",
        permanent: true,
      },
      {
        source: "/gaming/blog/monthly-releases/:postId",
        destination: "/gaming/blog/2026-monthly-gaming-releases/:postId",
        permanent: true,
      },
      // Battle Royale content moved into the Fortnite game hub (11gg-011).
      {
        source: "/fortnite/br",
        destination: "/fortnite",
        permanent: true,
      },
      {
        source: "/fortnite/br/blog/:path*",
        destination: "/fortnite/blog/:path*",
        permanent: true,
      },
      // The site root is app/(main)/page.tsx, the root landing of the gg
      // funnel, so no rule for / lives here. Every address this site ever
      // serves is added below when it moves, and nothing is ever removed.
      // See the docs post on URLs and redirects.
      //
      // Monthly gaming releases moved from the root blog to the gaming section
      // on 2026-10-02, when the site gained sections (11brain task 11gg-004).
      {
        source: "/blog/monthly-releases/:postId",
        destination: "/gaming/blog/2026-monthly-gaming-releases/:postId",
        permanent: true,
      },
      {
        source: "/blog/monthly-releases",
        destination: "/gaming/blog/2026-monthly-gaming-releases",
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
