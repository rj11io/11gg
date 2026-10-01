import type { Post } from "./types"

/**
 * The three kinds of thing the browse page can list. These are URL segments as
 * well as labels, so they stay lowercase and plural.
 */
export const browseContentTypes = ["posts", "publications", "authors"] as const

export type BrowseContentType = (typeof browseContentTypes)[number]

/** What /browse redirects to, and what a plain "Browse" link should point at. */
export const defaultBrowseContentType: BrowseContentType = "posts"

/**
 * Every blog address lives under this prefix. The site root is reserved for a
 * landing page and for sections that are not the blog, so a copy of this
 * platform can host tools and resources next to its posts. Moved on 2026-10-01.
 */
export const blogHref = "/blog"

/**
 * The base browse address. Kept separate because it is the redirect source
 * rather than a page: every link should use browseContentHref so no navigation
 * inside the site has to pass through the redirect.
 */
export const browseHref = `${blogHref}/browse`

export function browseContentHref(contentType: BrowseContentType) {
  return `${browseHref}/${contentType}`
}

export function publicationHref(pubId: string) {
  return `${blogHref}/${encodeURIComponent(pubId)}`
}

export function authorHref(authorId: string) {
  return `${blogHref}/authors/${encodeURIComponent(authorId)}`
}

export function postHref(pubId: string, post: Pick<Post, "postId" | "slug">) {
  return `${publicationHref(pubId)}/${encodeURIComponent(post.slug ?? String(post.postId))}`
}
