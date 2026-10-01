import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getSectionPosts, sectionTree } from "@content/registry"
import { sectionHref } from "@content/routes"

export const metadata: Metadata = {
  title: "Games",
  description: "Every game on this site, with what each one carries.",
  alternates: { canonical: "/games" },
}

/**
 * The browse page over every game section. A 404 on a site with no game
 * sections, which is what a plain blog is.
 */
export default function GamesPage() {
  const games = sectionTree.byKind("game")
  if (games.length === 0) notFound()

  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
        <header className="border-b border-border pb-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Browse</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Games</h1>
          <p className="mt-4 max-w-3xl leading-8 text-muted-foreground">
            {games.length} {games.length === 1 ? "game" : "games"}, each with its editions, blog, resources and tools.
          </p>
        </header>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => {
            const editions = sectionTree.children(game.id)
            const postCount = getSectionPosts(game.id, true).length
            const categories = (game.categories ?? []).map((id) => sectionTree.get(id).title)
            return (
              <li key={game.id}>
                <Link
                  href={sectionHref(sectionTree.path(game.id))}
                  className="group flex h-full flex-col border border-border bg-card p-6 transition-colors outline-none hover:border-foreground/40 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">{categories.join(" · ") || "Game"}</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight">{game.title}</h2>
                  {game.description ? <p className="mt-2 flex-1 leading-7 text-muted-foreground">{game.description}</p> : null}
                  <p className="mt-4 text-xs text-muted-foreground tabular-nums">
                    {editions.length} {editions.length === 1 ? "edition" : "editions"} · {postCount} {postCount === 1 ? "post" : "posts"}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </main>
  )
}
