/**
 * The site's own address, and the one place it is written down.
 *
 * Two things need it. The root layout hands it to Next as metadataBase, so that
 * every Open Graph image resolves to a real address instead of localhost. Share
 * links need it because no social network can post a root-relative path; a link
 * has to carry the host.
 *
 * It stays a constant rather than an environment variable because pages are
 * built ahead of time, so the value has to be known during the build. That also
 * gives the right answer on a preview deployment: a link shared from a preview
 * points at the live post, not at a URL that will disappear.
 */
export const siteOrigin = "https://gg.rj11.io"

/**
 * The site's name, as page titles and structured data say it. The header
 * wordmark is written in its own file on purpose: it is a visual, this is a
 * string that search results show.
 */
export const siteName = "11gg"

type SiteImage = { url: string; width: number; height: number; alt: string }

/**
 * The link preview for any page without a cover of its own: the landing, the
 * browse indexes, author pages, a post or publication with no cover. A file
 * under public, 1200 by 630, kept as a plain file so the address social
 * networks cache stays stable. undefined means those pages carry no preview
 * image at all, which is how a copy of the platform starts: our assets or
 * none. One line on purpose, the copy scripts rewrite it.
 */
export const siteOgImage: SiteImage | undefined = undefined

/**
 * Turns a root-relative path into a full address.
 *
 * Pass the result of a helper from content/routes.ts. Never assemble a path
 * here, because routes.ts owns every URL shape on the site. Escapes already in
 * the path are preserved rather than escaped a second time.
 */
export function absoluteUrl(path: string) {
  return new URL(path, siteOrigin).toString()
}
