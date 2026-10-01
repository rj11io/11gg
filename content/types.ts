/**
 * The section tree. See content/sections.ts for what each kind means.
 */
export type SectionKind = "root" | "category" | "game" | "edition"

export type Section = {
  id: string
  kind: SectionKind
  /** One path segment. Empty for the root, which lives at the site root. */
  segment: string
  title: string
  description?: string
  /** Every section but the root has one. */
  parentId?: string
  /** For games: ids of the category sections that list it. */
  categories?: string[]
}

/**
 * A curated link or file a section points its readers at. Content, not code:
 * the resources module of a section is this list filtered by sectionId.
 */
export type ResourceKind = "link" | "doc" | "video" | "file" | "community"

export type Resource = {
  id: string
  sectionId: string
  kind: ResourceKind
  title: string
  /** Absolute HTTPS address, or root-relative for a file in public. */
  url: string
  description?: string
  tags?: string[]
}

export type AuthorLink = {
  label: string
  url: string
}

export type Author = {
  id: string
  name: string
  displayName: string
  bio: string
  avatar?: string
  links?: AuthorLink[]
  tags: string[]
}

export type AuthorPreview = Pick<
  Author,
  "id" | "name" | "displayName" | "avatar"
>

export type AuthorListItem = Pick<
  Author,
  "id" | "name" | "displayName" | "bio" | "avatar" | "tags"
> & {
  href: string
  postCount: number
}

export type ImageListLayout = "quilted" | "masonry"

export type ImageListVariant = "image-only" | "title-inside" | "title-below"

export type PostImage = {
  src: string
  thumbnailSrc?: string
  width: number
  height: number
  alt: string
  title?: string
  subtitle?: string
}

export type PostImages = Readonly<Record<string, PostImage>>

export type PostImageList = {
  layout: ImageListLayout
  variant?: ImageListVariant
  images: readonly PostImage[]
  ariaLabel?: string
}

export type PostImageLists = Readonly<Record<string, PostImageList>>

export type Post = {
  postId: number
  slug?: string
  title: string
  excerpt?: string
  created: string
  updated?: string
  coverImage?: string
  authorIds: string[]
  isNSFW: boolean
  isNew: boolean
  isFeatured: boolean
  /** Unfinished. Kept out of the served site; see content/drafts.ts. */
  isDraft: boolean
  tags: string[]
  content?: string
  images?: PostImages
  imageLists?: PostImageLists
}

export type Publication = {
  relId: number
  pubId: string
  title: string
  description: string
  created: string
  updated?: string
  isNSFW: boolean
  isNew: boolean
  isFeatured: boolean
  /**
   * Unfinished. Hides the publication and every post inside it, whatever those
   * posts say for themselves. See content/drafts.ts.
   */
  isDraft: boolean
  tags: string[]
  synopsis?: string
  editorNotes?: string
  coverImage?: string
  /** The section whose blog this publication belongs to. Defaults to the root. */
  sectionId?: string
  posts: Post[]
}

export type PostListItem = Post & {
  authors: AuthorPreview[]
  sectionId: string
  /** Segments from the root, empty at the root. */
  sectionPath: string[]
  publicationId: string
  publicationTitle: string
  publicationHref: string
  href: string
  editorialIndex: number
}

export type PostPreview = Omit<
  PostListItem,
  "content" | "images" | "imageLists" | "authorIds"
>

export type PublicationPreview = Omit<Publication, "posts"> & {
  sectionId: string
  sectionPath: string[]
  href: string
  postCount: number
  /** Everyone with a byline on at least one of its posts. Derived, never authored. */
  authors: AuthorPreview[]
}
