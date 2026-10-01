import type { Resource } from "./types"

/**
 * Curated resources, per section. A section shows a resources page when at
 * least one entry names it. Keep an entry to one line of description: the
 * page is a list to scan, not prose. Every url is checked at build time for
 * shape, never for reachability: open each one when you add it.
 */
export const resources: Resource[] = []
