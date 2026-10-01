import type { Metadata } from "next"

import { BookmarksProvider } from "@/app/components/bookmarks-provider"
import {
  authorPreviews,
  getSectionAuthors,
  getSectionPosts,
  getSectionPublications,
  publicationPreviews,
  rootSection,
  sectionTree,
} from "@content/registry"
import { browseContentHref, browseContentTypes, type BrowseContentType } from "@content/routes"
import type { Section } from "@content/types"

import { Browse } from "../browse"

const descriptions: Record<BrowseContentType, string> = {
  posts: "Search every post, filter by tag, sort by date.",
  publications:
    "Every publication, with its subject and how many posts it holds.",
  authors: "Everyone who writes here, and what each of them has written.",
}

export function isBrowseContentType(value: string): value is BrowseContentType {
  return browseContentTypes.some((type) => type === value)
}

export function browseMetadata(section: Section, content: BrowseContentType): Metadata {
  return {
    title: `Browse ${content}`,
    description: descriptions[content],
    alternates: { canonical: browseContentHref(content, sectionTree.path(section.id)) },
  }
}

/**
 * The browse index of a section's blog. The root wrapper lives at app/blog/browse.
 *
 * The root browse is the site's search, so on a sectioned site it covers every
 * section below the root: a reader finds a post without knowing which section
 * holds it, and the header's Browse link never lands on an empty index. A
 * section's own browse stays scoped to that section. On a single-section site
 * the two readings are the same list.
 */
export function BrowsePage({ section, content }: { section: Section; content: BrowseContentType }) {
  const path = sectionTree.path(section.id)
  const wholeSite = section.id === rootSection.id

  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
        <BookmarksProvider>
          <Browse
            contentType={content}
            sectionPath={path}
            authors={wholeSite ? authorPreviews : getSectionAuthors(section.id)}
            posts={getSectionPosts(section.id, wholeSite)}
            publications={wholeSite ? publicationPreviews : getSectionPublications(section.id)}
          />
        </BookmarksProvider>
      </div>
    </main>
  )
}
