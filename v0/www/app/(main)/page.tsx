import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { rootSection, sectionTree } from "@content/registry"
import { blogHref } from "@content/routes"

import { SectionLanding, sectionMetadata } from "./blog/components/pages/section-landing"

export const metadata: Metadata = sectionMetadata(rootSection)

/**
 * The site root. A single-section site is its blog, so the root forwards to
 * /blog with a temporary redirect: nothing lives here yet and a cached
 * permanent one would fight a landing page added later. A sectioned site
 * renders the root section's landing: its categories and games, its own
 * modules, the latest posts from everywhere below.
 */
export default function RootPage() {
  if (sectionTree.children(rootSection.id).length === 0) redirect(blogHref)
  return <SectionLanding section={rootSection} />
}
