import type { MetadataRoute } from "next"

import { getSectionTools, tools } from "@/lib/tools"
import {
  allPosts,
  blogAuthors,
  getSectionPublications,
  getSectionResources,
  publicationPreviews,
  rootSection,
  sectionTree,
} from "@content/registry"
import {
  authorHref,
  blogHrefFor,
  browseContentTypes,
  browseContentHref,
  resourcesHrefFor,
  sectionHref,
  toolsHrefFor,
} from "@content/routes"
import { absoluteUrl } from "@/lib/site"

/**
 * Built from the registry, so it lists exactly what the site serves: drafts are
 * already gone, and every address comes from the same route helpers the pages
 * use. A post's lastModified is its updated date when it has one, otherwise
 * created; the blog landing page takes the newest date on the site. The site
 * root is listed when it has children, otherwise it redirects to the blog.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const postEntries = allPosts.map((post) => ({
    url: absoluteUrl(post.href),
    lastModified: post.updated ?? post.created,
  }))

  const newest = postEntries
    .map((entry) => entry.lastModified)
    .sort()
    .at(-1)

  return [
    // Section landings and available modules. The root blog and browse routes
    // always exist; a child section needs a publication for those routes.
    ...sectionTree.all.flatMap((section) => {
      const path = sectionTree.path(section.id)
      return [
        // The root is listed only when it is a landing page, which is when it
        // has children; otherwise it redirects to the blog listed next.
        ...(section.id === rootSection.id && sectionTree.children(section.id).length === 0
          ? []
          : [{ url: absoluteUrl(sectionHref(path)), lastModified: newest }]),
        ...(getSectionResources(section.id).length ? [{ url: absoluteUrl(resourcesHrefFor(path)), lastModified: newest }] : []),
        ...(getSectionTools(section.id).length ? [{ url: absoluteUrl(toolsHrefFor(path)), lastModified: newest }] : []),
        ...(section.id === rootSection.id || getSectionPublications(section.id).length > 0
          ? [
              { url: absoluteUrl(blogHrefFor(path)), lastModified: newest },
              ...browseContentTypes.map((contentType) => ({
                url: absoluteUrl(browseContentHref(contentType, path)),
                lastModified: newest,
              })),
            ]
          : []),
      ]
    }),
    ...publicationPreviews.map((publication) => ({
      url: absoluteUrl(publication.href),
      lastModified: publication.updated ?? publication.created,
    })),
    ...(sectionTree.byKind("game").length ? [{ url: absoluteUrl("/games"), lastModified: newest }] : []),
    ...postEntries,
    ...tools.map((tool) => ({ url: absoluteUrl(tool.href) })),
    ...blogAuthors.map((author) => ({
      url: absoluteUrl(authorHref(author.id)),
    })),
  ]
}
