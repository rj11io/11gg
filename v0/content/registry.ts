import { saveTheWorldLore } from "./publications/fortnite-save-the-world-lore-story-and-timeline"
import { fortniteLore } from "./publications/fortnite-lore-story-and-timeline"
import { authors } from "./authors"
import { includeDrafts } from "./drafts"
import { resources } from "./resources"
import { sections } from "./sections"
import { createSectionTree, rootSectionId } from "./section-tree"
import { blogPlatformDocs } from "./publications/blog-platform-docs"
import { fncs2026 } from "./publications/2026-fncs-and-majors-coverage"
import { monthlyReleases } from "./publications/2026-monthly-gaming-releases"
import { chapter8News } from "./publications/chapter-8-news-and-updates"
import { chapter7Season4 } from "./publications/chapter-7-season-4-news-and-updates"
import { wowForever } from "./publications/wow-forever-pre-release-news-and-updates"
import { pokemonChampionsUpdates } from "./publications/2026-pokemon-champions-news-and-updates"
import { authorHref, postHref, publicationHref } from "./routes"
import type {
  Author,
  AuthorListItem,
  AuthorPreview,
  Post,
  PostListItem,
  PostPreview,
  Publication,
  PublicationPreview,
} from "./types"
import { validatePublications, validateResources } from "./validation"

/**
 * Everything that has been written, drafts included. Private on purpose: this is
 * the list the validator checks, and the only thing that reads it is the filter
 * below.
 */
const authoredPublications: Publication[] = [
  fortniteLore,
  saveTheWorldLore,
  blogPlatformDocs,
  monthlyReleases,
  chapter7Season4,
  chapter8News,
  fncs2026,
  wowForever,
  pokemonChampionsUpdates,
]

export const blogAuthors: Author[] = authors

/**
 * Validation runs on everything, before anything is hidden. A draft is checked
 * by the same rules as a published post, so it cannot quietly rot while it waits
 * and cannot take an address that already belongs to something live. That is the
 * whole gain over the older habit of commenting out an import.
 */
validatePublications(authoredPublications, blogAuthors, sections)
validateResources(resources, sections)

/**
 * The section tree, validated above. Pages read a section's address, children
 * and ancestors from here; publications say which section they belong to.
 */
export const sectionTree = createSectionTree(sections)

export const rootSection = sectionTree.get(rootSectionId)

/** The curated resources of a section, in authored order. */
export function getSectionResources(sectionId: string) {
  return resources.filter((resource) => resource.sectionId === sectionId)
}

function sectionOf(publication: Pick<Publication, "sectionId">) {
  const sectionId = publication.sectionId ?? rootSectionId
  return { sectionId, sectionPath: sectionTree.path(sectionId) }
}

/**
 * What the site serves. Every export below is derived from this, so hiding a
 * draft happens exactly once, here.
 *
 * Both levels are filtered. A draft publication takes its posts with it whatever
 * those posts say for themselves, and a draft post disappears from a published
 * publication. Rebuilding the posts array rather than filtering only the derived
 * lists is what matters: the post page reads previous and next straight off
 * publication.posts, so a draft left in place would become a dead link out of a
 * live post. Removing it here renumbers the chain around the gap instead.
 *
 * A post inside a draft publication is then marked a draft itself, which is
 * simply true: it is not published, whatever its own flag says. Doing it here
 * rather than in the pages means every badge reads the honest value with no
 * further plumbing, so nothing rendered while drafts are being served can look
 * published when it is not.
 */
export const publications: Publication[] = authoredPublications
  .filter((publication) => includeDrafts || !publication.isDraft)
  .map((publication) => ({
    ...publication,
    posts: publication.posts
      .filter((post) => includeDrafts || !post.isDraft)
      .map((post) =>
        publication.isDraft && !post.isDraft ? { ...post, isDraft: true } : post
      ),
  }))

const authorsById = new Map(blogAuthors.map((author) => [author.id, author]))

function toAuthorPreview(author: Author): AuthorPreview {
  return {
    id: author.id,
    name: author.name,
    displayName: author.displayName,
    avatar: author.avatar,
  }
}

function resolveAuthors(post: Post) {
  return post.authorIds.map((authorId) => {
    const author = authorsById.get(authorId)
    if (!author) {
      throw new Error(`${post.title} references unknown author ${authorId}`)
    }
    return toAuthorPreview(author)
  })
}

/**
 * A publication's authors: everyone with a byline on at least one of its posts,
 * ordered by how many they wrote and then by name. That puts the main author
 * first, which is the useful signal on a card, and keeps the order stable rather
 * than depending on which post happens to come first.
 *
 * Derived rather than declared. A field on the publication would be a second
 * place for the same fact to live, and the two would eventually disagree.
 */
function authorsFromPosts(posts: Post[]): AuthorPreview[] {
  const tally = new Map<string, { author: AuthorPreview; posts: number }>()

  for (const post of posts) {
    for (const author of resolveAuthors(post)) {
      const entry = tally.get(author.id)
      if (entry) entry.posts += 1
      else tally.set(author.id, { author, posts: 1 })
    }
  }

  return [...tally.values()]
    .sort(
      (a, b) => b.posts - a.posts || a.author.name.localeCompare(b.author.name)
    )
    .map((entry) => entry.author)
}

/** For pages holding a whole publication rather than a preview of one. */
export function getPublicationAuthors(publication: Publication) {
  return authorsFromPosts(publication.posts)
}

export const allPosts: PostListItem[] = publications.flatMap((publication) => {
  const { sectionId, sectionPath } = sectionOf(publication)
  return publication.posts.map((post, editorialIndex) => ({
    ...post,
    authors: resolveAuthors(post),
    sectionId,
    sectionPath,
    publicationId: publication.pubId,
    publicationTitle: publication.title,
    publicationHref: publicationHref(publication.pubId, sectionPath),
    href: postHref(publication.pubId, post, sectionPath),
    editorialIndex,
  }))
})

export const publicationPreviews: PublicationPreview[] = publications.map(
  ({ posts, ...publication }) => {
    const { sectionId, sectionPath } = sectionOf(publication)
    return {
      ...publication,
      sectionId,
      sectionPath,
      href: publicationHref(publication.pubId, sectionPath),
      postCount: posts.length,
      authors: authorsFromPosts(posts),
    }
  }
)

/** Publications whose blog is this section's. */
export function getSectionPublications(sectionId: string) {
  return publicationPreviews.filter((publication) => publication.sectionId === sectionId)
}

function toPostPreview(post: PostListItem): PostPreview {
  return {
    postId: post.postId,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    created: post.created,
    updated: post.updated,
    coverImage: post.coverImage,
    authors: post.authors,
    isNSFW: post.isNSFW,
    isNew: post.isNew,
    isFeatured: post.isFeatured,
    // Carried through rather than dropped. A preview only ever describes a post
    // the site is showing, so this is false in a production build; it is here so
    // the draft badge has something to read when drafts are being served.
    isDraft: post.isDraft,
    tags: post.tags,
    sectionId: post.sectionId,
    sectionPath: post.sectionPath,
    publicationId: post.publicationId,
    publicationTitle: post.publicationTitle,
    publicationHref: post.publicationHref,
    href: post.href,
    editorialIndex: post.editorialIndex,
  }
}

export const postPreviews = allPosts.map(toPostPreview)

export const authorPreviews: AuthorListItem[] = blogAuthors.map((author) => ({
  id: author.id,
  name: author.name,
  displayName: author.displayName,
  bio: author.bio,
  avatar: author.avatar,
  tags: author.tags,
  href: authorHref(author.id),
  postCount: postPreviews.filter((post) =>
    post.authors.some((postAuthor) => postAuthor.id === author.id)
  ).length,
}))

export function getPublication(pubId: string) {
  return publications.find((publication) => publication.pubId === pubId)
}

/** A publication by id, only if its blog is the given section's. */
export function getSectionPublication(sectionId: string, pubId: string) {
  const publication = getPublication(pubId)
  return publication && (publication.sectionId ?? rootSectionId) === sectionId ? publication : undefined
}

export function getPost(pubId: string, postKey: string) {
  const publication = getPublication(pubId)
  if (!publication) return undefined

  const postIndex = publication.posts.findIndex(
    (post) => post.slug === postKey || String(post.postId) === postKey
  )
  if (postIndex === -1) return undefined

  const post = publication.posts[postIndex]

  return {
    publication,
    post,
    authors: resolveAuthors(post),
    postIndex,
  }
}

export function getAuthor(authorId: string) {
  return authorsById.get(authorId)
}

/** Posts whose publication belongs to the section, or to it and everything below it. */
export function getSectionPosts(sectionId: string, includeDescendants = false): PostPreview[] {
  const ids = new Set([sectionId, ...(includeDescendants ? sectionTree.descendants(sectionId).map((section) => section.id) : [])])
  return postPreviews.filter((post) => ids.has(post.sectionId))
}

/** Every author, with the post count inside the section. */
export function getSectionAuthors(sectionId: string): AuthorListItem[] {
  const posts = getSectionPosts(sectionId)
  return authorPreviews.map((author) => ({
    ...author,
    postCount: posts.filter((post) => post.authors.some((postAuthor) => postAuthor.id === author.id)).length,
  }))
}

/** A post by publication and slug or number, only inside the section. */
export function getSectionPost(sectionId: string, pubId: string, postKey: string) {
  return getSectionPublication(sectionId, pubId) ? getPost(pubId, postKey) : undefined
}

export function getPostsByAuthor(authorId: string) {
  return postPreviews.filter((post) =>
    post.authors.some((author) => author.id === authorId)
  )
}

export function getPostPreview(publication: Publication, post: Post) {
  const editorialIndex = publication.posts.indexOf(post)
  const { sectionId, sectionPath } = sectionOf(publication)
  const item: PostListItem = {
    ...post,
    authors: resolveAuthors(post),
    sectionId,
    sectionPath,
    publicationId: publication.pubId,
    publicationTitle: publication.title,
    publicationHref: publicationHref(publication.pubId, sectionPath),
    href: postHref(publication.pubId, post, sectionPath),
    editorialIndex,
  }
  return toPostPreview(item)
}

export function getPostContent(post: Post) {
  return post.content?.trim() || null
}

export function stripLeadingH1(markdown: string) {
  return markdown.replace(/^\s*#\s+[^\n]+\n+/, "")
}
