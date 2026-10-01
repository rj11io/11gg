import type { Metadata } from "next"
import Link from "next/link"

import { getSectionTools } from "@/lib/tools"
import { sectionTree } from "@content/registry"
import { toolsHrefFor } from "@content/routes"
import type { Section } from "@content/types"

import { BreadcrumbJsonLd, SectionCrumbs, sectionCrumbItems } from "../section-breadcrumb"

export function toolsMetadata(section: Section): Metadata {
  return {
    alternates: { canonical: toolsHrefFor(sectionTree.path(section.id)) },
    title: `${section.title} tools`,
    description: `Tools built for ${section.title}.`,
  }
}

/** A section's tools index: one card per registered tool. The tools themselves are route folders. */
export function ToolsPage({ section }: { section: Section }) {
  const items = getSectionTools(section.id)
  const path = sectionTree.path(section.id)

  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
        <BreadcrumbJsonLd items={[...sectionCrumbItems(section), { name: "Tools", href: toolsHrefFor(path) }]} />
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <SectionCrumbs section={section} />
            {path.length === 0 ? <li><span>Home</span></li> : null}
            {path.length === 0 ? <li aria-hidden="true">/</li> : null}
            <li aria-current="page" className="text-foreground">Tools</li>
          </ol>
        </nav>
        <header className="mt-8 border-b border-border pb-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Tools</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{section.title} tools</h1>
          <p className="mt-4 max-w-3xl leading-8 text-muted-foreground">
            {items.length === 1 ? "One tool" : `${items.length} tools`} built here, free to use.
          </p>
        </header>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group flex h-full flex-col border border-border bg-card p-6 transition-colors outline-none hover:border-foreground/40 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <h2 className="text-xl font-semibold tracking-tight">{tool.title}</h2>
              <p className="mt-2 flex-1 leading-7 text-muted-foreground">{tool.description}</p>
              <span aria-hidden="true" className="mt-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground">→</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
