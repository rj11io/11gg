import { getSectionTools } from "@/lib/tools"
import {
  getSectionPosts,
  getSectionPublications,
  getSectionResources,
  rootSection,
  sectionTree,
} from "@content/registry"
import { browseContentTypes, type BrowseContentType } from "@content/routes"
import type { Section } from "@content/types"

/**
 * What a path under a section means. The catch-all route turns the URL
 * segments into one of these and renders the matching page component.
 */
export type SectionRoute = { section: Section; path: string[] } & (
  | { kind: "landing" }
  | { kind: "resources" }
  | { kind: "tools" }
  | { kind: "blog" }
  | { kind: "browse"; content: BrowseContentType }
  | { kind: "publication"; pubId: string }
  | { kind: "post"; pubId: string; postId: string }
)

function isBrowseContentType(value: string): value is BrowseContentType {
  return browseContentTypes.some((type) => type === value)
}

/**
 * Walks the tree as far as the segments go, then reads the rest as a module
 * address. The root section never resolves here: its pages are the static
 * routes under app/(main)/blog, and Next prefers those.
 */
export function resolveSectionRoute(segments: string[]): SectionRoute | undefined {
  let section = rootSection
  let depth = 0
  for (; depth < segments.length; depth += 1) {
    const child = sectionTree
      .children(section.id)
      .find((candidate) => candidate.segment === segments[depth])
    if (!child) break
    section = child
  }
  const path = segments.slice(0, depth)
  const rest = segments.slice(depth)
  const base = { section, path }

  // The root's landing and blog are static routes; only its two module
  // indexes come through here, and only when they have something to show.
  if (section.id === rootSection.id) {
    if (rest.length === 1 && rest[0] === "resources" && getSectionResources(section.id).length) return { ...base, kind: "resources" }
    if (rest.length === 1 && rest[0] === "tools" && getSectionTools(section.id).length) return { ...base, kind: "tools" }
    return undefined
  }

  if (rest.length === 0) return { ...base, kind: "landing" }
  if (rest.length === 1 && rest[0] === "resources") return { ...base, kind: "resources" }
  if (rest.length === 1 && rest[0] === "tools") return { ...base, kind: "tools" }
  if (rest[0] !== "blog") return undefined
  if (rest.length === 1) return { ...base, kind: "blog" }
  if (rest[1] === "browse") {
    return rest.length === 3 && isBrowseContentType(rest[2])
      ? { ...base, kind: "browse", content: rest[2] }
      : undefined
  }
  if (rest.length === 2) return { ...base, kind: "publication", pubId: rest[1] }
  if (rest.length === 3) return { ...base, kind: "post", pubId: rest[1], postId: rest[2] }
  return undefined
}

/** Every address the catch-all builds: one entry per page of every non-root section. */
export function sectionStaticParams(): { path: string[] }[] {
  const params: { path: string[] }[] = []
  for (const section of sectionTree.all) {
    const path = sectionTree.path(section.id)
    if (getSectionResources(section.id).length) params.push({ path: [...path, "resources"] })
    if (getSectionTools(section.id).length) params.push({ path: [...path, "tools"] })
    if (section.id === rootSection.id) continue
    params.push({ path })
    if (getSectionPublications(section.id).length === 0) continue
    params.push({ path: [...path, "blog"] })
    for (const content of browseContentTypes) params.push({ path: [...path, "blog", "browse", content] })
    for (const publication of getSectionPublications(section.id)) {
      params.push({ path: [...path, "blog", publication.pubId] })
    }
    for (const post of getSectionPosts(section.id)) {
      params.push({ path: [...path, "blog", post.publicationId, post.slug ?? String(post.postId)] })
    }
  }
  return params
}
