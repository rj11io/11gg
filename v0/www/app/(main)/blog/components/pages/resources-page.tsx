import type { Metadata } from "next"

import { getSectionResources, sectionTree } from "@content/registry"
import type { Resource, Section } from "@content/types"

import { SectionCrumbs } from "../section-breadcrumb"

const kindLabel: Record<Resource["kind"], string> = {
  link: "Links",
  doc: "Documentation",
  video: "Videos",
  file: "Files",
  community: "Communities",
}

const kindOrder: Resource["kind"][] = ["doc", "link", "video", "file", "community"]

export function resourcesMetadata(section: Section): Metadata {
  return {
    title: `${section.title} resources`,
    description: `Curated links, documentation and files for ${section.title}.`,
  }
}

/** A section's curated resources, grouped by kind. Plain HTML, nothing runs in the browser. */
export function ResourcesPage({ section }: { section: Section }) {
  const items = getSectionResources(section.id)
  const groups = kindOrder
    .map((kind) => ({ kind, items: items.filter((item) => item.kind === kind) }))
    .filter((group) => group.items.length > 0)
  const path = sectionTree.path(section.id)

  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <SectionCrumbs section={section} />
            {path.length === 0 ? <li><span>Home</span></li> : null}
            {path.length === 0 ? <li aria-hidden="true">/</li> : null}
            <li aria-current="page" className="text-foreground">Resources</li>
          </ol>
        </nav>
        <header className="mt-8 border-b border-border pb-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Resources</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{section.title}</h1>
          <p className="mt-4 max-w-3xl leading-8 text-muted-foreground">
            {items.length} {items.length === 1 ? "resource" : "resources"}, kept short on purpose: things worth opening, not everything that exists.
          </p>
        </header>
        {groups.map((group) => (
          <section key={group.kind} aria-labelledby={`resources-${group.kind}`} className="mt-10">
            <h2 id={`resources-${group.kind}`} className="text-2xl font-semibold tracking-tight">{kindLabel[group.kind]}</h2>
            <ul className="mt-4 divide-y divide-border">
              {group.items.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.url}
                    target={item.url.startsWith("http") ? "_blank" : undefined}
                    rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="-mx-3 flex items-start justify-between gap-4 px-3 py-4 transition-colors outline-none hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="min-w-0">
                      <span className="block font-semibold text-foreground">{item.title}</span>
                      {item.description ? <span className="mt-1 block text-sm leading-6 text-muted-foreground">{item.description}</span> : null}
                      {item.tags?.length ? (
                        <span className="mt-2 flex flex-wrap gap-1.5">
                          {item.tags.map((tag) => (
                            <span key={tag} className="border border-border px-2 py-0.5 text-[11px] text-muted-foreground">{tag}</span>
                          ))}
                        </span>
                      ) : null}
                    </span>
                    <span aria-hidden="true" className="shrink-0 text-muted-foreground">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}
