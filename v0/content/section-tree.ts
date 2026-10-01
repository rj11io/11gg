import type { Section, SectionKind } from "./types"

/**
 * Helpers over the section tree. Pure functions of the authored list, used by
 * the validator, the registry and the pages. Nothing here knows about
 * publications: a section is an address and a place in the tree, publications
 * point at it.
 */
export const rootSectionId = "root"

/**
 * Segments a section may never use, because a module or a site route owns that
 * address under every section. blog, resources and tools are the modules; the
 * rest are site-level routes and files.
 */
export const reservedSegments = new Set([
  "blog",
  "resources",
  "tools",
  "games",
  "authors",
  "browse",
  "publications",
  "static",
  "feed.xml",
  "sitemap.xml",
  "robots.txt",
  "_next",
  "api",
])

const segmentPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function createSectionTree(sections: readonly Section[]) {
  const byId = new Map(sections.map((section) => [section.id, section]))

  function get(id: string): Section {
    const section = byId.get(id)
    if (!section) throw new Error(`Unknown section ${id}`)
    return section
  }

  /** Root first, the section last. */
  function ancestors(id: string): Section[] {
    const chain: Section[] = []
    let current: Section | undefined = get(id)
    while (current) {
      chain.unshift(current)
      current = current.parentId ? get(current.parentId) : undefined
    }
    return chain
  }

  /** Path segments from the root, empty for the root itself. */
  function path(id: string): string[] {
    return ancestors(id)
      .map((section) => section.segment)
      .filter(Boolean)
  }

  function children(id: string): Section[] {
    return sections.filter((section) => section.parentId === id)
  }

  /** Every section below this one, depth first. */
  function descendants(id: string): Section[] {
    return children(id).flatMap((child) => [child, ...descendants(child.id)])
  }

  function byKind(kind: SectionKind): Section[] {
    return sections.filter((section) => section.kind === kind)
  }

  /** The section at a path of segments, or undefined. */
  function findByPath(segments: readonly string[]): Section | undefined {
    let current = byId.get(rootSectionId)
    for (const segment of segments) {
      current = children(current?.id ?? "").find((child) => child.segment === segment)
      if (!current) return undefined
    }
    return current
  }

  return { all: sections, get, has: (id: string) => byId.has(id), ancestors, path, children, descendants, byKind, findByPath }
}

export type SectionTree = ReturnType<typeof createSectionTree>

/**
 * The rules the build enforces on the tree. Thrown messages name the section.
 */
export function validateSections(sections: readonly Section[]) {
  const ids = new Set<string>()
  const roots = sections.filter((section) => section.kind === "root")
  if (roots.length !== 1 || roots[0].id !== rootSectionId) {
    throw new Error(`sections must have exactly one root section with id ${rootSectionId}`)
  }

  for (const section of sections) {
    if (!idPattern.test(section.id)) {
      throw new Error(`${section.id}: section id must be a URL-safe slug`)
    }
    if (ids.has(section.id)) throw new Error(`Duplicate section id: ${section.id}`)
    ids.add(section.id)
    if (!section.title.trim()) throw new Error(`${section.id}.title must not be empty`)

    if (section.kind === "root") {
      if (section.segment !== "" || section.parentId) {
        throw new Error(`${section.id}: the root section has no segment and no parent`)
      }
      continue
    }
    if (!section.parentId) throw new Error(`${section.id}: every section except the root needs a parentId`)
    if (!segmentPattern.test(section.segment)) {
      throw new Error(`${section.id}: segment must be a URL-safe slug`)
    }
    if (reservedSegments.has(section.segment)) {
      throw new Error(`${section.id}: segment ${section.segment} is reserved for a module or a site route`)
    }
  }

  const byId = new Map(sections.map((section) => [section.id, section]))
  for (const section of sections) {
    if (section.parentId && !byId.has(section.parentId)) {
      throw new Error(`${section.id}: parent ${section.parentId} does not exist`)
    }
    // Cycles: walk up at most the number of sections.
    let current = section
    for (let steps = 0; current.parentId; steps += 1) {
      if (steps > sections.length) throw new Error(`${section.id}: section tree has a cycle`)
      current = byId.get(current.parentId)!
    }
    const siblings = sections.filter(
      (other) => other !== section && other.parentId === section.parentId && other.segment === section.segment
    )
    if (siblings.length) {
      throw new Error(`${section.id}: segment ${section.segment} is used twice under the same parent`)
    }
    if (section.kind === "edition" && byId.get(section.parentId ?? "")?.kind !== "game") {
      throw new Error(`${section.id}: an edition must sit under a game`)
    }
    for (const category of section.categories ?? []) {
      if (byId.get(category)?.kind !== "category") {
        throw new Error(`${section.id}: category ${category} is not a category section`)
      }
    }
  }
}
