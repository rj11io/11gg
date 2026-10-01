export const sectionsAndModules = `
# Sections and modules

A site built on this platform is a tree of sections, and every section can carry three modules: a blog, a resources list, and tools. This site is the smallest case, one root section with a blog at /blog. A site that covers several games is the same platform with more rows in one file. This post explains the tree, the addresses it produces, and how each module works. Documentation map: [Working with the platform](/blog/blog-platform-docs/working-with-the-platform).

## The tree

content/sections.ts is a list. Every entry has an id, a kind, one path segment, a title, and a parent, plus an optional description for cards and an optional body, Markdown shown on the landing under the title. Exactly one entry is the root: kind root, an empty segment, no parent.

~~~ts
export const sections: Section[] = [
  { id: "root", kind: "root", segment: "", title: "11gg" },
  { id: "gaming", kind: "category", segment: "gaming", parentId: "root", title: "Gaming" },
  { id: "pokemon", kind: "game", segment: "pokemon", parentId: "root", title: "Pokémon", categories: ["gaming"] },
  { id: "champions", kind: "edition", segment: "champions", parentId: "pokemon", title: "Pokémon Champions" },
]
~~~

Three kinds besides the root:

| Kind | What it is | Landing page shows |
| --- | --- | --- |
| category | A theme games are tagged with, like gaming or esports | The games tagged with it |
| game | A game, listed on the games browse page | Its editions |
| edition | A version, mode or era of a game | Its modules |

A section's address is its ancestors' segments joined: /pokemon/champions. The root is the site root. The validator refuses a tree with two roots, a missing parent, a cycle, two siblings with one segment, an edition outside a game, or a segment that a module or a site route owns: blog, resources, tools, games, authors, browse and a few more. Messages are in [Content validation rules](/blog/blog-platform-docs/content-validation).

## Addresses

| Address | What it shows |
| --- | --- |
| /{section} | The section's landing: what is below it, which modules it has, the latest posts from it and everything under it |
| /{section}/blog | That section's blog landing |
| /{section}/blog/browse/posts | Its searchable indexes, also publications and authors. The root's indexes cover the whole site |
| /{section}/blog/{pubId} | One publication |
| /{section}/blog/{pubId}/{slug} | One post |
| /{section}/resources | Its curated resources |
| /{section}/tools | Its tools index |
| /{section}/tools/{tool} | One tool |
| /games | Every game section, with its categories, editions and post count. A 404 on a site with no games |

The root section drops the prefix: /blog, /resources, /tools, the last two only when the root has resources or tools. The site root itself is the root section's landing when the tree has more than the root, and a redirect to /blog when it does not. The root browse is the site's search: it lists every post, publication and author below the root, while a section's browse lists that section alone. Authors are site-wide, at /blog/authors/{authorId}. The feed, the sitemap and the robots file stay at the site root and cover every section.

Paths and slugs are references: a section about a game may use the game's full official name as its segment. The site's own name, domain and logo are the site's own; that rule lives outside this post.

## The blog module

A publication names its section with sectionId. Left out, it belongs to the root, which is why this site's publication files say nothing about sections.

~~~ts
export const champions: Publication = {
  pubId: "updates",
  sectionId: "champions",
  // ...the usual fields
}
~~~

Everything a section's blog shows comes from publications that name it: the landing, the browse indexes, the counts. A game's landing also lists the latest posts of its editions, so a parent is never empty when its children have writing. A pubId is unique within its section, so two sections may each have a publication called updates; the section path tells them apart, and the bookmark keys carry it too.

## The resources module

content/resources.ts is a list of curated links and files, each naming a section:

~~~ts
export const resources: Resource[] = [
  { id: "champions-site", sectionId: "champions", kind: "link", title: "Official site", url: "https://champions.pokemon.com/" },
  { id: "champions-patches", sectionId: "champions", kind: "doc", title: "Patch list", url: "https://www.serebii.net/pokemonchampions/patch.shtml", tags: ["patches"] },
]
~~~

Kinds: link, doc, video, file, community. The page groups by kind. A section with no entry has no resources page, and the landing shows no card for it. The validator checks the id, the section, the kind and the shape of the url. It never opens the url: open it yourself when you add it.

## The tools module

A tool is code, not content. It lives where every module in the app lives, in a route folder with its own components and scripts:

~~~text
v0/www/app/(main)/pokemon/champions/tools/damage-calc/
├── page.tsx
├── components/
└── scripts/
~~~

One line in v0/www/lib/tools.ts registers it, so the landing card, the tools index and the sitemap know it exists:

~~~ts
export const tools: Tool[] = [
  { id: "damage-calc", sectionId: "champions", title: "Damage calculator", description: "Type matchups and ranges.", href: "/pokemon/champions/tools/damage-calc" },
]
~~~

The registry is checked when it loads: the section must exist and the href must be the section's tools path plus the id. A tool that deserves its own life, with tests and a package, lives under v0/packages and the route folder is a thin page that imports it.

Why a tool can sit on a section's path at all: Next resolves a real folder before the dynamic route that renders section pages, so /pokemon/champions/tools/damage-calc goes to the folder and /pokemon/champions/blog goes to the data route. Nothing per section needs code unless it has a tool.

## How the pages are built

Two route trees under v0/www/app/(main), the group that carries the header and footer:

- blog/: the root section's pages, static routes, unchanged since the blog moved under /blog. Each page is a thin wrapper that passes the root section to a shared page component in blog/components/pages.
- [...path]/: one dynamic route for every page of every other section. It walks the tree as far as the segments go, reads the rest as a module address, and renders the same shared components with that section. Its list of addresses is built from the tree at build time; anything off the list is a 404.

The root layout holds only the shell: fonts, theme, analytics, the metadata base. (main)/layout.tsx is the first custom point. A page that needs a different frame goes in another group beside it.

## Making a copy multi-section

1. Add the sections to content/sections.ts, root first.
2. Give each publication its sectionId. Publications without one stay at the root.
3. Add resources and tools as the sections earn them.
4. Build. Every section's addresses appear, the landing cards follow what exists, the sitemap lists it all.
5. Nothing to point. The wordmark and the 404 page read homeHref from lib/section-routes.ts: the site root once the tree has more than the root, /blog before. Nothing else in the app knows about sections.

Nothing changes for a single-section site: this post renders on one.
`
