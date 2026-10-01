import type { Metadata } from "next"
import Link from "next/link"

import { getSectionTools } from "@/lib/tools"
import {
  getSectionPosts,
  getSectionPublications,
  getSectionResources,
  sectionTree,
} from "@content/registry"
import { blogHrefFor, resourcesHrefFor, sectionHref, toolsHrefFor } from "@content/routes"
import type { PostPreview, Section } from "@content/types"

import { Markdown } from "../markdown"
import { BreadcrumbJsonLd, SectionCrumbs, sectionCrumbItems } from "../section-breadcrumb"
import { siteName } from "@/lib/site"

const kindLabel: Record<Section["kind"], string> = {
  root: "Home",
  category: "Category",
  game: "Game",
  edition: "Edition",
}

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

function byNewest<T extends { created: string }>(items: readonly T[]) {
  return [...items].sort((a, b) => b.created.localeCompare(a.created))
}

export function sectionMetadata(section: Section): Metadata {
  return {
    title: section.kind === "root" ? { absolute: siteName } : section.title,
    description: section.description,
    alternates: { canonical: sectionHref(sectionTree.path(section.id)) },
  }
}

function Card({ href, eyebrow, title, description }: { href: string; eyebrow: string; title: string; description?: string }) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col border border-border bg-card p-6 transition-colors outline-none hover:border-foreground/40 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">{eyebrow}</p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight">{title}</h3>
      {description ? <p className="mt-2 flex-1 leading-7 text-muted-foreground">{description}</p> : null}
      <span aria-hidden="true" className="mt-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground">→</span>
    </Link>
  )
}

function PostRow({ post }: { post: PostPreview }) {
  return (
    <li>
      <Link
        href={post.href}
        className="-mx-3 flex items-center justify-between gap-4 px-3 py-4 transition-colors outline-none hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="min-w-0">
          <span className="block text-xs font-semibold tracking-[0.14em] text-primary uppercase">{post.publicationTitle}</span>
          <span className="mt-1 block font-semibold">{post.title}</span>
        </span>
        <time className="shrink-0 text-xs text-muted-foreground" dateTime={post.created}>
          {dateFormatter.format(new Date(`${post.created}T00:00:00Z`))}
        </time>
      </Link>
    </li>
  )
}

/**
 * The landing page of a section: what is below it, which modules it has, and
 * the latest posts from it and everything under it. A category lists the games
 * tagged with it; a game lists its editions; an edition lists its modules.
 */
export function SectionLanding({ section }: { section: Section }) {
  const path = sectionTree.path(section.id)
  const children =
    section.kind === "category"
      ? sectionTree.byKind("game").filter((game) => game.categories?.includes(section.id))
      : sectionTree.children(section.id)
  const publications = getSectionPublications(section.id)
  const postCount = getSectionPosts(section.id).length
  const resourceCount = getSectionResources(section.id).length
  const toolCount = getSectionTools(section.id).length
  const latest = byNewest(getSectionPosts(section.id, true)).slice(0, 6)

  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
        <BreadcrumbJsonLd items={sectionCrumbItems(section)} />
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <SectionCrumbs section={section} current />
          </ol>
        </nav>

        <header className="mt-8 border-b border-border pb-10">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">{kindLabel[section.kind]}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">{section.title}</h1>
          {section.description ? (
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">{section.description}</p>
          ) : null}
        </header>

        {section.body ? (
          <div className="mt-2 max-w-3xl">
            <Markdown content={section.body} />
          </div>
        ) : null}

        {children.length > 0 ? (
          <section aria-labelledby="sections-heading" className="mt-12">
            <h2 id="sections-heading" className="text-2xl font-semibold tracking-tight">
              {section.kind === "category" ? "Games" : section.kind === "game" ? "Editions" : section.kind === "root" ? "Explore" : "Sections"}
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {children.map((child) => (
                <Card
                  key={child.id}
                  href={sectionHref(sectionTree.path(child.id))}
                  eyebrow={kindLabel[child.kind]}
                  title={child.title}
                  description={child.description}
                />
              ))}
            </div>
          </section>
        ) : null}

        {publications.length > 0 || resourceCount > 0 || toolCount > 0 ? (
          <section aria-labelledby="modules-heading" className="mt-12">
            <h2 id="modules-heading" className="text-2xl font-semibold tracking-tight">Here</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {publications.length > 0 ? (
                <Card
                  href={blogHrefFor(path)}
                  eyebrow="Blog"
                  title={`${publications.length} ${publications.length === 1 ? "publication" : "publications"}`}
                  description={`${postCount} ${postCount === 1 ? "post" : "posts"} so far.`}
                />
              ) : null}
              {resourceCount > 0 ? (
                <Card
                  href={resourcesHrefFor(path)}
                  eyebrow="Resources"
                  title={`${resourceCount} ${resourceCount === 1 ? "resource" : "resources"}`}
                  description="Curated links, documentation and files."
                />
              ) : null}
              {toolCount > 0 ? (
                <Card
                  href={toolsHrefFor(path)}
                  eyebrow="Tools"
                  title={`${toolCount} ${toolCount === 1 ? "tool" : "tools"}`}
                  description="Built here, free to use."
                />
              ) : null}
            </div>
          </section>
        ) : null}

        {latest.length > 0 ? (
          <section aria-labelledby="latest-heading" className="mt-12">
            <h2 id="latest-heading" className="text-2xl font-semibold tracking-tight">Latest</h2>
            <ul className="mt-2 divide-y divide-border">
              {latest.map((post) => (
                <PostRow key={`${post.publicationId}-${post.postId}`} post={post} />
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  )
}
