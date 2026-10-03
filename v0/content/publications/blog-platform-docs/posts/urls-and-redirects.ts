export const urlsAndRedirects = `
# URLs, slugs, and redirects

One file builds every address. Every address that ever worked keeps working. This post covers: how URLs are built, how a post is found from one, what to do on a rename. Doc map: [Working with the platform](/blog/blog-platform-docs/working-with-the-platform).

## One file owns every URL shape

v0/content/routes.ts is the only place that knows the site's address shapes:

~~~ts
export function sectionHref(path: SectionPath = []) {
  return path.length ? \`/\${path.map(encodeURIComponent).join("/")}\` : "/"
}

export function blogHrefFor(path: SectionPath = []) {
  return path.length ? \`\${sectionHref(path)}/blog\` : "/blog"
}

export const blogHref = blogHrefFor()

export function browseContentHref(contentType: BrowseContentType, path: SectionPath = []) {
  return \`\${blogHrefFor(path)}/browse/\${contentType}\`
}

export function publicationHref(pubId: string, path: SectionPath = []) {
  return \`\${blogHrefFor(path)}/\${encodeURIComponent(pubId)}\`
}

export function authorHref(authorId: string) {
  return \`\${blogHref}/authors/\${encodeURIComponent(authorId)}\`
}

export function postHref(pubId: string, post: Pick<Post, "postId" | "slug">, path: SectionPath = []) {
  return \`\${publicationHref(pubId, path)}/\${encodeURIComponent(post.slug ?? String(post.postId))}\`
}
~~~

Every helper takes a section path, the segments from the site root, and defaults to the root, so a single-section site calls them without one. Pages, cards, breadcrumbs, next-and-previous links, the header's home link: all call these functions or use blogHref. One exception: redirect sources in next.config.ts (historical addresses, plain strings, never rebuilt by a helper). Changing a live address shape is a one-file change; the compiler finds every caller. Moving the whole blog under /blog on 2026-10-01 was exactly that: blogHref appeared, three helpers gained the prefix, and nothing else in the app changed.

Two properties:

- Every piece is escaped. An identifier with an unusual character cannot break the address.
- A post falls back to its numeric ID when it has no slug. This is what makes slugs optional.

The addresses on the site:

| Address | What it shows |
| --- | --- |
| / | The site root. On a single-section site it forwards to /blog; on a sectioned site it is the root landing |
| /blog | The blog landing page |
| /blog/browse/posts | The searchable index of posts, across every section |
| /blog/browse/publications | The searchable index of publications, across every section |
| /blog/browse/authors | The searchable index of authors, with site-wide post counts |
| /blog/{pubId} | One publication and its posts |
| /blog/{pubId}/{slug} | One post |
| /blog/authors/{authorId} | One author and everything they have written |
| /{section}/... | The same blog shapes under a section's path, plus the section landing, /{section}/resources and /{section}/tools. See [Sections and modules](/blog/blog-platform-docs/sections-and-modules) |

Everything the blog serves sits under /blog. The site root and any other top-level path are free for a landing page, tools, or resources, so a copy of this platform is a blog section inside a site rather than the whole site. Inside /blog, publications sit directly under the prefix with no further nesting. Reason for the reserved-word rule below.

Browse has three addresses, content type as a path segment, not a query parameter. Two consequences: each of the three is built ahead of time with its own title and description; an unrecognised type such as /blog/browse/drafts is a 404, not a page quietly showing something else.

/blog/browse alone redirects to /blog/browse/posts. No link inside the site points there: every one calls browseContentHref, so site navigation never passes through that redirect. It exists for external links and hand-typed addresses.

## How a post URL is resolved

Request for /blog/blog-platform-docs/adding-content: the registry looks up the publication by section and id, then searches its posts for a match on slug or numeric ID as text:

~~~ts
const postIndex = publication.posts.findIndex(
  (post) => post.slug === postKey || String(post.postId) === postKey
)
~~~

Looks like two working addresses per post. It is not.

The lookup accepts either form; only one is built as a page. The route lists its addresses:

~~~ts
postId: post.slug ?? String(post.postId),
~~~

A post with a slug contributes only its slug. Nothing outside that list exists: /blog/blog-platform-docs/402 returns 404 even though the lookup would resolve it. Every post currently has a slug, so no numeric address exists on the site.

The numeric branch matters only for a post with no slug; then it is that post's single address. Rule: one address per post, slug if present, number otherwise.

The lookup also returns the post's array position, used for the previous and next links at the foot of a post. Editorial order is array order. See [The content contract](/blog/blog-platform-docs/content-contract).

## Reserved publication IDs

Publications live directly under /blog, so a publication ID could collide with a real route at that level. Three words refused outright:

~~~text
authors
browse
publications
~~~

A publication using one would be shadowed by the same-name route and unreachable. The validator rejects it with "browse: pubId conflicts with a reserved route" before the site builds.

New route directly under /blog: add its name to reservedPublicationIds in v0/content/validation.ts in the same change. Forgotten, it surfaces much later as a publication that will not open.

Section segments have a reserved list of their own, in v0/content/section-tree.ts: blog, resources, tools, games, authors, browse, publications and the site's files. A section cannot take a name a module or a site route owns.

## Only known addresses exist

The four content routes (publication, post, author, browse) each list their addresses ahead of time and refuse everything else. Post page:

~~~tsx
export const dynamicParams = false

export function generateStaticParams() {
  return allPosts.map((post) => ({
    pubId: post.publicationId,
    postId: post.slug ?? String(post.postId),
  }))
}
~~~

generateStaticParams lists every address to build. dynamicParams false: anything off the list is a 404, never rendered on demand. Pages under a section come from one dynamic route, v0/www/app/(main)/[...path], that lists every section address the same way.

Three consequences:

- **New content requires a build.** No way to add a post to a running site. Intended trade: the site is a set of files, nothing generated at request time.
- **A draft has no address.** The list comes from the registry, drafts already removed. Nothing is built, the path is a 404 like any other unknown address. No page checks a flag; no half-published state. See [Adding a publication or post](/blog/blog-platform-docs/adding-content).
- **A typo in a link is caught as a 404, not as a broken page.** Not checked: links written inside post prose. /blog/blog-platform-docs/does-not-exist builds happily and 404s for the reader. Click the internal links you write.

## Internal and external links in prose

The renderer sorts links into three kinds in v0/www/app/(main)/blog/components/markdown.tsx, test defined in markdown-utils.ts:

- Starts with a hash: plain anchor, browser handles it, jumps within the page.
- Starts with a single forward slash: internal, app navigation, no page reload.
- Anything else: external, new tab, rel noopener noreferrer.

The internal test excludes two lookalikes:

~~~ts
export function isInternalHref(href: string) {
  return (
    href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/\\\\")
  )
}
~~~

Two slashes: a full address to another site with the scheme left off. Slash then backslash: a known trick browsers may read the same way. Both leave the site while looking internal; both excluded.

Author rule: write internal links as root-relative paths, starting with a slash.

## Renaming without breaking links

Changing a publication ID or post slug changes its public address. The old address must keep working: add a redirect.

Redirects live in v0/www/next.config.ts. Worked example: this publication, renamed twice. Started as blog-tech under a /publications prefix, became blog-platform, now blog-platform-docs. Every one of those addresses still resolves.

First rename, four rules:

~~~ts
{ source: "/blog-tech/:postId", destination: "/blog-platform/:postId", permanent: true },
{ source: "/blog-tech", destination: "/blog-platform", permanent: true },
{ source: "/publications/blog-tech/:postId", destination: "/blog-platform/:postId", permanent: true },
{ source: "/publications/blog-tech", destination: "/blog-platform", permanent: true },
~~~

Second rename, two rules:

~~~ts
{ source: "/blog-platform/:postId", destination: "/blog/blog-platform-docs/:postId", permanent: true },
{ source: "/blog-platform", destination: "/blog/blog-platform-docs", permanent: true },
~~~

The first set still points at blog-platform, no longer a real publication. Deliberate: **redirects chain.** /blog-tech/design-tokens forwards to /blog-platform/design-tokens, the browser follows, the second set forwards to /blog/blog-platform-docs/design-tokens. Two hops, one working page.

Pointing old rules straight at the current name would save a hop, but every rename would then mean editing every rule that ever pointed at the old name. Chaining: each rename adds rules, never edits them. Harder to get wrong.

One exception in the file. Three rules handle posts renamed whose publication then moved; those point straight at the final address:

~~~ts
{ source: "/blog-platform/markdown-components",
  destination: "/blog/blog-platform-docs/markdown-reference", permanent: true },
~~~

They must sit above the general /blog-platform/:postId rule. A source matches on path alone, first matching rule wins; listed after it, an old slug forwards to a publication with no post by that name.

Two more rules handle the dropped prefix for every other publication:

~~~ts
{ source: "/publications/:pubId/:postId", destination: "/blog/:pubId/:postId", permanent: true },
{ source: "/publications/:pubId", destination: "/blog/:pubId", permanent: true },
~~~

Ordering: specific blog-tech rules before general prefix rules (first match wins). Reversed, nothing breaks outright: /publications/blog-tech strips to /blog-tech, itself a redirect source, and the chain above still resolves. Cost: an extra hop per request. Specific rules first keeps every historical address within at most three hops.

permanent true sends a 308: browsers and search engines record the move as final.

### Moving the whole blog under a prefix

Third worked example, the largest: on 2026-10-01 every blog address moved under /blog. Three helpers changed in routes.ts, the route folder moved from a route group to a real segment, and every address that existed on that day got a redirect.

The tempting rule is one catch-all, /:pubId to /blog/:pubId. It is wrong. Redirects run before the filesystem, public files included, so that rule would also forward /feed.xml, /static/..., and /blog itself. The file instead names the eleven publications that existed on the day of the move:

~~~ts
{ source: "/:pubId(ai-benchmarks|ai-coaching-advisory|...|tech-tutorials)/:postId",
  destination: "/blog/:pubId/:postId", permanent: true },
{ source: "/:pubId(ai-benchmarks|ai-coaching-advisory|...|tech-tutorials)",
  destination: "/blog/:pubId", permanent: true },
{ source: "/authors/:authorId", destination: "/blog/authors/:authorId", permanent: true },
{ source: "/browse/:content(posts|publications|authors)",
  destination: "/blog/browse/:content", permanent: true },
~~~

A publication created after the move never had a root address, so the list never grows. Two more decisions in that change:

- Every older rule whose destination named a live address was edited to carry the prefix, so an old link still lands in one hop. The chaining rule above was not broken: rules pointing at an already-redirected address were left alone.
- The site root forwards to /blog from the root page itself, with a temporary redirect, so a sectioned site can render a landing page there instead without fighting a cached permanent one.

### Moving a query parameter into the path

Second worked example: the browse page. Covers a case the publication rename does not: old addresses that differed only by query string.

Content type used to be a query parameter. /browse?content=publications is now /blog/browse/publications. Four rules, destinations carrying the prefix since the move:

~~~ts
{ source: "/browse", has: [{ type: "query", key: "content", value: "publications" }],
  destination: "/blog/browse/publications", permanent: true },
{ source: "/browse", has: [{ type: "query", key: "content", value: "authors" }],
  destination: "/blog/browse/authors", permanent: true },
{ source: "/browse", has: [{ type: "query", key: "content", value: "posts" }],
  destination: "/blog/browse/posts", permanent: true },
{ source: "/browse", destination: "/blog/browse/posts", permanent: true },
~~~

Two takeaways:

- **A source matches the path only.** All four rules share one source; the query is matched separately through has. The bare rule must come last: listed first, it matches every /browse request regardless of query, and an old authors link lands on posts.
- **The query string survives the redirect.** /browse?content=authors arrives at /blog/browse/authors?content=authors. The parameter is now meaningless, the page ignores it, it stays in the address. Stripping it needs middleware, not worth writing for something a reader will not notice.

### Renaming a publication

1. Change pubId in the publication's file; rename its directory to match.
2. Add two redirects: one for the publication, one for its posts using the :postId placeholder.
3. Old ID also reachable under a prefix or an even older name: add rules for those too, above any general rule that could swallow them.
4. Search the content directory for the old ID. Links in post prose are plain text; the compiler will not update them. They still work through the redirect, but internal links should point at the current address.
5. Run build, open the old address, confirm it lands in the right place.

### Renaming a post slug

Same shape, one rule instead of two. Real rule, in the file:

~~~ts
{ source: "/online-presence/three-ways-to-build-a-blog",
  destination: "/blog/online-presence/build-your-own-blog", permanent: true }
~~~

No safety net. The numeric ID is not a working address (see above), so the redirect is the only thing keeping the old link alive. Write it in the same change as the rename, not afterwards.

Second live example: Working with the platform, renamed from "A tour of the platform" on 2026-08-04; its rule forwards /blog-platform-docs/start-here. Both old addresses still resolve.

A rename is rarely one line: a title appears in more places than the slug. That one touched seven things: slug and title in the publication file, first-level heading in the post body, the post's filename and export name, two links in other posts' prose, the cover image, this rule. Cover matters most, missed most easily: the title is drawn into the picture, so a renamed post keeping its old cover shows the old title to everyone who shares it. Covers are generated: rerun the generator for a new file, never edit the old one in place.

Nothing checks any of this. Grep for the old slug and the old title separately before you finish: a link in prose and a title baked into an image will not fail a build.

### Removing a publication or post

Deleting content leaves its address returning 404 (the styled page covered in [Feeds, crawlers, and the 404 page](/blog/blog-platform-docs/feeds-and-crawlers)). If the piece was public for any length of time, redirect somewhere sensible instead: the publication it belonged to, or /blog/browse/posts. A real page beats a dead end.

Setting isDraft on something already published removes its address the same way. Same treatment: add a redirect if the address was public for any length of time, and check whether another post links to it in prose (nothing validates those links).

## Moving a section's blog into its game

On 11gg, Battle Royale coverage lives directly in Fortnite's blog. The old /fortnite/br landing redirects permanently to /fortnite, and /fortnite/br/blog/:path* redirects to /fortnite/blog/:path*. The wildcard includes the blog landing, browse indexes, publications and posts. Post slugs and reading order stay the same. Canonicals, breadcrumbs, sitemap entries and feed links follow the publication's new sectionId. Existing bookmark keys and feed item GUIDs change once because they include the section path.

Battle Royale, Zero Build and Reload are mode tags, applied to posts that cover them. A product branch or dedicated competitive scene can still have a child section.

## When a path is not enough

Every helper in v0/content/routes.ts returns a path starting with a slash: enough for links inside the site. Two things need the whole address, host and all: link previews social networks read, and the share links on post and publication pages.

The host lives in v0/www/lib/site.ts, once, as siteOrigin, with absoluteUrl beside it to join the two halves:

~~~tsx
absoluteUrl(postHref(publication.pubId, post))
~~~

Shape of that call: routes.ts decides the path, site.ts prepends the host. Never assemble a path inside absoluteUrl; never write the host anywhere else. It was written twice for a while (layout and share links): exactly how two copies of a hostname start to disagree.

Constant, not a runtime setting: pages are built ahead of time, so the value must be known during the build. Also right on preview deployments: a link shared from a preview points at the live post, not at an address that stops working next week.

## Rules of thumb

- Choose the slug carefully at the start. It is the address; changing it costs a redirect forever.
- Never delete a redirect. The file only grows, and that is correct. Old links live in bookmarks, feeds, and search results.
- Specific rules above general ones.
- Build paths by calling the helpers in v0/content/routes.ts, never by writing a string. Full address needed: wrap the call in absoluteUrl.
- After any rename, check the old address by hand. A redirect that does not fire looks exactly like a working site until someone follows an old link.
`
