import type { Post } from "./types"

/**
 * Segments of a section from the root. The root is []. Every helper below
 * takes one, defaulting to the root, so a single-section site calls them
 * exactly as before and a sectioned site passes the publication's path.
 */
export type SectionPath = readonly string[]

/**
 * The three kinds of thing the browse page can list. These are URL segments as
 * well as labels, so they stay lowercase and plural.
 */
export const browseContentTypes = ["posts", "publications", "authors"] as const

export type BrowseContentType = (typeof browseContentTypes)[number]

/** What a bare browse address redirects to, and what a plain "Browse" link should point at. */
export const defaultBrowseContentType: BrowseContentType = "posts"

/** The address of a section: / for the root, /pokemon/champions for an edition. */
export function sectionHref(path: SectionPath = []) {
  return path.length ? `/${path.map(encodeURIComponent).join("/")}` : "/"
}

/**
 * Every blog address of a section lives under this prefix. The section root
 * stays free for its landing page, and for the resources and tools modules.
 * At the site root that is /blog, moved there on 2026-10-01.
 */
export function blogHrefFor(path: SectionPath = []) {
  return path.length ? `${sectionHref(path)}/blog` : "/blog"
}

/** A section's curated resources list. */
export function resourcesHrefFor(path: SectionPath = []) {
  return `${sectionHref(path)}${path.length ? "/" : ""}resources`
}

/** A section's tools index. Each tool lives at its own folder below it. */
export function toolsHrefFor(path: SectionPath = []) {
  return `${sectionHref(path)}${path.length ? "/" : ""}tools`
}

/** The site's own blog. */
export const blogHref = blogHrefFor()

/**
 * The base browse address of a section. Kept separate because it is the
 * redirect source rather than a page: every link should use browseContentHref
 * so no navigation inside the site has to pass through the redirect.
 */
export function browseHrefFor(path: SectionPath = []) {
  return `${blogHrefFor(path)}/browse`
}

export const browseHref = browseHrefFor()

export function browseContentHref(contentType: BrowseContentType, path: SectionPath = []) {
  return `${browseHrefFor(path)}/${contentType}`
}

export function publicationHref(pubId: string, path: SectionPath = []) {
  return `${blogHrefFor(path)}/${encodeURIComponent(pubId)}`
}

/** Authors are site-wide: one page per author, under the root blog. */
export function authorHref(authorId: string) {
  return `${blogHref}/authors/${encodeURIComponent(authorId)}`
}

export function postHref(pubId: string, post: Pick<Post, "postId" | "slug">, path: SectionPath = []) {
  return `${publicationHref(pubId, path)}/${encodeURIComponent(post.slug ?? String(post.postId))}`
}
