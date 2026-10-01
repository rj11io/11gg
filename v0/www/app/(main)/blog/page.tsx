import type { Metadata } from "next"

import { rootSection } from "@content/registry"
import { blogHref } from "@content/routes"
import { siteName } from "@/lib/site"

import { BlogLanding } from "./components/pages/blog-landing"

export const metadata: Metadata = {
  title: { absolute: siteName },
  alternates: { canonical: blogHref },
  description:
    "Games followed update by update: a monthly releases calendar and a section per game, each with its own blog, resources and tools.",
}

/** The site's own blog: the root section's landing, with the site's own copy. */
export default function HomePage() {
  return (
    <BlogLanding
      section={rootSection}
      hero={{
        eyebrow: "Gaming and esports",
        title: "Games, followed update by update.",
        description:
          "A releases calendar every month, and a section for each game: its blog, a short list of resources, and tools built here.",
      }}
    />
  )
}
