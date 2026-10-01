import type { Metadata } from "next"

import { BookmarksProvider } from "@/app/components/bookmarks-provider"
import {
  getSectionAuthors,
  getSectionPosts,
  getSectionPublications,
  sectionTree,
} from "@content/registry"
import { browseContentHref, browseContentTypes, type BrowseContentType } from "@content/routes"
import type { Section } from "@content/types"

import { Browse } from "../browse"

const descriptions: Record<BrowseContentType, string> = {
  posts: "Search and filter every post across the collection.",
  publications:
    "Every publication in the collection, with its subject and post count.",
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

/** The browse index of a section's blog. The root wrapper lives at app/blog/browse. */
export function BrowsePage({ section, content }: { section: Section; content: BrowseContentType }) {
  const path = sectionTree.path(section.id)

  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
        <BookmarksProvider>
          <Browse
            contentType={content}
            sectionPath={path}
            authors={getSectionAuthors(section.id)}
            posts={getSectionPosts(section.id)}
            publications={getSectionPublications(section.id)}
          />
        </BookmarksProvider>
      </div>
    </main>
  )
}
