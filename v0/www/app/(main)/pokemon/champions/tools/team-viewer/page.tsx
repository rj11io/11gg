import type { Metadata } from "next"
import Link from "next/link"

import { sectionTree } from "@content/registry"
import { toolsHrefFor } from "@content/routes"

import { BreadcrumbJsonLd, SectionCrumbs, sectionCrumbItems } from "@/app/(main)/blog/components/section-breadcrumb"

import { TeamViewer } from "./components/team-viewer"

const section = sectionTree.get("pokemon-champions")
const href = "/pokemon/champions/tools/team-viewer"

export const metadata: Metadata = {
  title: "Team viewer",
  description: "Paste a Pokémon Champions team in the Showdown export format and see it as cards.",
  alternates: { canonical: href },
}

/** The first tool on the site: a route folder under its section, registered in lib/tools.ts. */
export default function TeamViewerPage() {
  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
        <BreadcrumbJsonLd
          items={[
            ...sectionCrumbItems(section),
            { name: "Tools", href: toolsHrefFor(sectionTree.path(section.id)) },
            { name: "Team viewer", href },
          ]}
        />
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <SectionCrumbs section={section} />
            <li>
              <Link href={toolsHrefFor(sectionTree.path(section.id))} className="underline-offset-4 hover:text-foreground hover:underline">
                Tools
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground">Team viewer</li>
          </ol>
        </nav>
        <header className="mt-8 border-b border-border pb-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Tool</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Team viewer</h1>
          <p className="mt-4 max-w-3xl leading-8 text-muted-foreground">
            Paste a team in the Showdown export format, the text every team builder exports, and see it as cards: sprite, item, ability, Tera type, nature, EVs, IVs, moves. The same cards the posts here use. Everything stays in your browser.
          </p>
        </header>
        <div className="mt-8">
          <TeamViewer />
        </div>
      </div>
    </main>
  )
}
