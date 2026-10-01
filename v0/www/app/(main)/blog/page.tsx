import type { Metadata } from "next"

import { rootSection } from "@content/registry"

import { BlogLanding } from "./components/pages/blog-landing"

export const metadata: Metadata = {
  title: "11gg",
  description:
    "Gaming and esports: release calendars, game news and the sites under the gg vertical of rj11.io.",
}

/** The site's own blog: the root section's landing, with the site's own copy. */
export default function HomePage() {
  return (
    <BlogLanding
      section={rootSection}
      hero={{
        eyebrow: "Gaming and esports",
        title: "The gaming side of rj11.io.",
        description:
          "Release calendars every month, and a section for each game we follow, each with its own blog, resources and tools.",
      }}
    />
  )
}
