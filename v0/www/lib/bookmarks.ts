export const BOOKMARKS_NAMESPACE = "11blog"
export const BOOKMARKS_COLLECTION = "bookmarks-v1"

export type BookmarkTargetType = "author" | "publication" | "post"

export type BookmarkTarget = {
  targetType: BookmarkTargetType
  targetKey: string
  href: string
}

export type BookmarkRecord = BookmarkTarget & {
  id: string
  savedAt: string
  [key: string]: unknown
}

/**
 * Keys carry the section path so two sections with a publication of the same
 * id do not share a bookmark. The root section adds nothing, which keeps every
 * bookmark saved before sections existed.
 */
function scoped(publicationId: string, sectionPath: readonly string[] = []) {
  return sectionPath.length ? `${sectionPath.join("/")}/${publicationId}` : publicationId
}

export function publicationBookmarkKey(publicationId: string, sectionPath: readonly string[] = []) {
  return `publication:${scoped(publicationId, sectionPath)}`
}

export function authorBookmarkKey(authorId: string) {
  return `author:${authorId}`
}

export function postBookmarkKey(publicationId: string, postId: number, sectionPath: readonly string[] = []) {
  return `post:${scoped(publicationId, sectionPath)}:${postId}`
}

export function isBookmarkRecord(value: unknown): value is BookmarkRecord {
  if (!value || typeof value !== "object") return false

  const record = value as Record<string, unknown>

  return (
    typeof record.id === "string" &&
    (record.targetType === "author" ||
      record.targetType === "publication" ||
      record.targetType === "post") &&
    typeof record.targetKey === "string" &&
    typeof record.href === "string" &&
    typeof record.savedAt === "string"
  )
}
